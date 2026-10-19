import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { toaster } from 'toasterhea'
import { randomHex } from 'web3-utils'
import { z } from 'zod'
import { Alert } from '~/components/Alert'
import { Button } from '~/components/Button'
import CropImageModal from '~/components/CropImageModal/CropImageModal'
import { Hint } from '~/components/Hint'
import {
    PropertyDropdown,
    PropertyDropdownList,
    PropertyIcon,
} from '~/components/PropertyDropdown'
import { BehindIndexError } from '~/errors/BehindIndexError'
import { getParsedOperatorByOwnerAddress } from '~/getters'
import FormModal, {
    ErrorLabel,
    FieldWrap,
    FormModalProps,
    Section,
    SectionHeadline,
    TextAppendix,
    TextInput,
    TextareaCounter,
    TextareaInput,
    WingedLabelWrap,
} from '~/modals/FormModal'
import { Operator } from '~/parsers/Operator'
import { createOperator, updateOperator } from '~/services/operators'
import AvatarImage from '~/shared/components/AvatarImage'
import SvgIcon from '~/shared/components/SvgIcon'
import Label from '~/shared/components/Ui/Label'
import { useWalletAccount } from '~/shared/stores/wallet'
import { COLORS, TABLET } from '~/shared/utils/styled'
import { sleep, waitForIndexedBlock } from '~/utils'
import { Layer } from '~/utils/Layer'
import {
    RejectionReason,
    isRejectionReason,
    isTransactionRejection,
} from '~/utils/exceptions'
import { getImageCrossOrigin } from '~/utils/ipfs'

interface Props extends Pick<FormModalProps, 'onReject'> {
    chainId: number
    onResolve?: (params: { operatorId: string; blockNumber: number }) => void
    operator: Operator | undefined
}

const cropModal = toaster(CropImageModal, Layer.Modal)

const DescriptionLengthLimit = 120

interface Form {
    cut: string
    description: string
    imageToUpload: File | undefined
    name: string
    redundancyFactor: string
    url: string
    email: string
    twitter: string
    x: string
    telegram: string
    reddit: string
    linkedIn: string
}

const Validator = z.object({
    cut: z.coerce
        .number()
        .min(0, 'Value must be between 0 and 100')
        .max(100, 'Value must be between 0 and 100'),
    description: z.string().max(DescriptionLengthLimit, 'Description is too long'),
    imageToUpload: z.instanceof(File).optional(),
    name: z.string().trim().min(1, 'Name is required'),
    redundancyFactor: z.coerce.number().min(1, 'Value must be greater or equal to 1'),
    url: z.union([z.literal(''), z.string().url()]),
    email: z.union([z.literal(''), z.string().email()]),
    twitter: z.union([z.literal(''), z.string().url()]),
    x: z.union([z.literal(''), z.string().url()]),
    telegram: z.union([z.literal(''), z.string().url()]),
    reddit: z.union([z.literal(''), z.string().url()]),
    linkedIn: z.union([z.literal(''), z.string().url()]),
})

function OperatorModal({ onResolve, onReject, operator, chainId, ...props }: Props) {
    const [title, submitLabel] = operator
        ? ['Edit Operator', 'Save']
        : ['Become an Operator', 'Become an Operator']

    const [busy, setBusy] = useState(false)

    const currentData: Form = useMemo(
        () => ({
            cut: operator?.operatorsCut.toString() || '',
            description: operator?.metadata.description || '',
            imageToUpload: undefined,
            name: operator?.metadata.name || '',
            redundancyFactor: operator?.metadata.redundancyFactor?.toString() || '2',
            url: operator?.metadata.url || '',
            email: operator?.metadata.email || '',
            twitter: operator?.metadata.twitter || '',
            x: operator?.metadata.x || '',
            telegram: operator?.metadata.telegram || '',
            reddit: operator?.metadata.reddit || '',
            linkedIn: operator?.metadata.linkedIn || '',
        }),
        [operator],
    )

    const [nextData, updateNextData] = useState<Form>(currentData)

    useEffect(() => {
        /**
         * Handle an update coming from the outside. It won't happen often
         * but it can happen.
         */
        updateNextData(currentData)
    }, [currentData])

    const changelog: Record<keyof Form, boolean> = {
        imageToUpload: !!nextData.imageToUpload,
        name: currentData.name !== nextData.name,
        description: currentData.description !== nextData.description,
        redundancyFactor:
            Number(currentData.redundancyFactor) !== Number(nextData.redundancyFactor),
        cut: Number(currentData.cut) !== Number(nextData.cut),
        url: currentData.url !== nextData.url,
        email: currentData.email !== nextData.email,
        twitter: currentData.twitter !== nextData.twitter,
        x: currentData.x !== nextData.x,
        telegram: currentData.telegram !== nextData.telegram,
        reddit: currentData.reddit !== nextData.reddit,
        linkedIn: currentData.linkedIn !== nextData.linkedIn,
    }

    const dirty = Object.values(changelog).some(Boolean)

    const randomAddress = useMemo<string>(() => randomHex(20), [])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const imageBlob =
        (nextData.imageToUpload && URL.createObjectURL(nextData.imageToUpload)) ||
        operator?.metadata.imageUrl

    const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})

    function resetError(key: keyof Form) {
        setErrors(({ [key]: _, ...c }) => c)
    }

    function validate(fn: () => void) {
        try {
            fn()
        } catch (e) {
            if (e instanceof z.ZodError) {
                const newErrors = {}

                e.issues.forEach(({ path, message }) => {
                    newErrors[path.join('.')] = message
                })

                setErrors((existingErrors) => ({
                    ...existingErrors,
                    ...newErrors,
                }))
            }

            throw e
        }
    }

    const finalData = useMemo(() => {
        try {
            return Validator.parse(nextData)
        } catch (_) {
            return null
        }
    }, [nextData])

    const walletAddress = useWalletAccount()

    const canSubmit = !busy && !!finalData && dirty && !!walletAddress

    const readonlyCut = !!operator && operator.stakes.length > 0

    return (
        <FormModal
            {...props}
            title={title}
            canSubmit={canSubmit}
            submitLabel={submitLabel}
            submitting={busy}
            onBeforeAbort={(reason) =>
                !busy && (reason !== RejectionReason.Backdrop || !dirty)
            }
            onReject={onReject}
            onSubmit={async () => {
                if (!canSubmit) {
                    return
                }

                setBusy(true)

                try {
                    let blockNumber = 0

                    if (!operator) {
                        await createOperator(chainId, finalData, {
                            onReceipt: ({ blockNumber: blockNo }) => {
                                blockNumber = blockNo

                                return waitForIndexedBlock(chainId, blockNo)
                            },
                        })
                    } else {
                        await updateOperator(chainId, operator, finalData, {
                            onReceipt: ({ blockNumber: blockNo }) => {
                                blockNumber = blockNo

                                return waitForIndexedBlock(chainId, blockNo)
                            },
                        })
                    }

                    let operatorId = operator?.id

                    if (!operatorId) {
                        /**
                         * The following loop ensures that each thrown instance of `BehindIndexError`
                         * causes a proper retry.
                         */
                        for (;;) {
                            try {
                                /**
                                 * If the following request hits the indexer too early, i.e. before block
                                 * at `blockNumber` got ingested, it'll give us nothing (it does not know
                                 * about the operator). The above loop helps maneuver through such edge case.
                                 */
                                operatorId = (
                                    await getParsedOperatorByOwnerAddress(
                                        chainId,
                                        walletAddress,
                                        {
                                            force: true,
                                            minBlockNumber: blockNumber,
                                        },
                                    )
                                )?.id
                            } catch (e) {
                                if (!(e instanceof BehindIndexError)) {
                                    throw e
                                }

                                /**
                                 * If we're behind on the indexed blocks with the operator id request
                                 * we have to retry until we're good to move forward. Let's wait 5s
                                 * and retry.
                                 */
                                await sleep(5000)

                                continue
                            }

                            /**
                             * After all the trying the operator id can still be nullish. In such case we don't
                             * wanna continue. It is, after all, unexpected behaviour, especially for newly
                             * created operator.
                             */
                            if (!operatorId) {
                                throw new Error('Empty operator id')
                            }

                            break
                        }
                    }

                    onResolve?.({ operatorId, blockNumber })
                } catch (e) {
                    if (isRejectionReason(e)) {
                        return
                    }

                    if (isTransactionRejection(e)) {
                        return
                    }

                    throw e
                } finally {
                    setBusy(false)
                }
            }}
        >
            <SectionHeadline>
                Please choose the percentage for the Owner&apos;s cut{' '}
                <Hint>
                    <p>
                        The Owner&apos;s cut percentage is the earnings split between the
                        Operator and its Delegators. This value can be updated as long as
                        the Operator is not staked on any&nbsp;Sponsorships.
                    </p>
                </Hint>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label $wrap>Owner&apos;s cut percentage*</Label>
                    {errors?.cut && <ErrorLabel>{errors.cut}</ErrorLabel>}
                </WingedLabelWrap>
                <FieldWrap $invalid={!!errors?.cut} $grayedOut={readonlyCut}>
                    <TextInput
                        name="cut"
                        autoFocus={!readonlyCut}
                        onChange={({ target: { value: cut } }) => {
                            updateNextData((c) => ({
                                ...c,
                                cut,
                            }))
                        }}
                        placeholder="0"
                        readOnly={busy}
                        type="number"
                        min={0}
                        max={100}
                        value={nextData.cut}
                        disabled={readonlyCut}
                    />
                    <TextAppendix>%</TextAppendix>
                </FieldWrap>
            </Section>
            {readonlyCut && (
                <AlertContainer>
                    <Alert type="notice" title="Owner's cut locked">
                        <span>
                            The owner&apos;s cut can&apos;t be modified while staked. To
                            change it, fully unstake from all sponsorships.
                        </span>
                    </Alert>
                </AlertContainer>
            )}
            <SectionHeadline>
                Please input your node redundancy factor{' '}
                <Hint>
                    <p>
                        Sets the amount of duplicated work when running a fleet of
                        multiple nodes. Doing redundant work protects against slashing in
                        case some of your nodes experience failures. For example, setting
                        this to 1 means that no duplication of work occurs (the feature is
                        off), and setting it to 2 means that each stream assignment will
                        be worked on by 2 nodes in your fleet.
                    </p>
                </Hint>
            </SectionHeadline>
            <Section>
                <WingedLabelWrap>
                    <Label $wrap>Node redundancy factor*</Label>
                    {errors?.redundancyFactor && (
                        <ErrorLabel>{errors.redundancyFactor}</ErrorLabel>
                    )}
                </WingedLabelWrap>
                <FieldWrap $invalid={!!errors?.redundancyFactor}>
                    <TextInput
                        name="redundancyFactor"
                        onChange={({ target: { value: redundancyFactor } }) => {
                            updateNextData((c) => ({
                                ...c,
                                redundancyFactor,
                            }))
                        }}
                        placeholder="2"
                        readOnly={busy}
                        type="number"
                        min={1}
                        max={100}
                        step={1}
                        value={nextData.redundancyFactor}
                    />
                </FieldWrap>
            </Section>
            <AboutOperator>
                <SectionHeadline>About Operator</SectionHeadline>
                <Section>
                    <WingedLabelWrap>
                        <Label $wrap>Display name*</Label>
                        {errors?.name && <ErrorLabel>{errors.name}</ErrorLabel>}
                    </WingedLabelWrap>
                    <FieldWrap $invalid={!!errors?.name}>
                        <TextInput
                            name="name"
                            onChange={({ target: { value: name } }) => {
                                updateNextData((c) => ({
                                    ...c,
                                    name,
                                }))
                            }}
                            readOnly={busy}
                            type="text"
                            value={nextData.name}
                            placeholder="Name"
                        />
                    </FieldWrap>
                    <AboutOperatorField>
                        <WingedLabelWrap>
                            <Label $wrap>Description</Label>
                            {errors?.description && (
                                <ErrorLabel>Description is too long</ErrorLabel>
                            )}
                        </WingedLabelWrap>
                        <FieldWrap $invalid={!!errors?.description}>
                            <TextareaInput
                                name="description"
                                onChange={({ target: { value: description } }) => {
                                    updateNextData((c) => ({
                                        ...c,
                                        description,
                                    }))
                                }}
                                readOnly={busy}
                                value={nextData.description}
                                placeholder="Description"
                                $minHeight={110}
                            />
                            <TextareaCounter $invalid={!!errors?.description}>
                                {nextData.description.length}/{DescriptionLengthLimit}
                            </TextareaCounter>
                        </FieldWrap>
                        <PropertyDropdownList>
                            <li>
                                <PropertyDropdown
                                    error={errors?.url}
                                    onChange={() => {
                                        resetError('url')
                                    }}
                                    onDismiss={() => {
                                        resetError('url')
                                    }}
                                    onSubmit={(url) => {
                                        resetError('url')

                                        validate(() => {
                                            Validator.pick({
                                                url: true,
                                            }).parse({ url })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            url,
                                        }))
                                    }}
                                    placeholder="https://siteinfo.com"
                                    submitLabel="Add site URL"
                                    title="Add a site URL"
                                    toggleIcon={<PropertyIcon name="web" />}
                                    value={nextData.url}
                                    valuePlaceholder="Site URL"
                                />
                            </li>
                            <li>
                                <PropertyDropdown
                                    error={errors?.email}
                                    onChange={() => {
                                        resetError('email')
                                    }}
                                    onDismiss={() => {
                                        resetError('email')
                                    }}
                                    onSubmit={(email) => {
                                        resetError('email')

                                        validate(() => {
                                            Validator.pick({
                                                email: true,
                                            }).parse({ email })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            email,
                                        }))
                                    }}
                                    placeholder="owner@example.com"
                                    submitLabel="Add contact email"
                                    title="Add a contact email"
                                    toggleIcon={<PropertyIcon name="email" />}
                                    value={nextData.email}
                                    valuePlaceholder="Contact email"
                                />
                            </li>
                            <li>
                                <PropertyDropdown
                                    error={errors?.twitter}
                                    onChange={() => {
                                        resetError('twitter')
                                    }}
                                    onDismiss={() => {
                                        resetError('twitter')
                                    }}
                                    onSubmit={(twitter) => {
                                        resetError('twitter')

                                        validate(() => {
                                            Validator.pick({
                                                twitter: true,
                                            }).parse({ twitter })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            twitter,
                                        }))
                                    }}
                                    submitLabel="Add Twitter link"
                                    title="Add Twitter link"
                                    toggleIcon={
                                        <PropertyIcon
                                            name="twitter"
                                            $color={
                                                nextData.twitter ? '#1da1f2' : undefined
                                            }
                                        />
                                    }
                                    value={nextData.twitter}
                                />
                            </li>
                            <li>
                                <PropertyDropdown
                                    error={errors?.x}
                                    onChange={() => {
                                        resetError('x')
                                    }}
                                    onDismiss={() => {
                                        resetError('x')
                                    }}
                                    onSubmit={(x) => {
                                        resetError('x')

                                        validate(() => {
                                            Validator.pick({
                                                x: true,
                                            }).parse({ x })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            x,
                                        }))
                                    }}
                                    submitLabel="Add X link"
                                    title="Add X link"
                                    toggleIcon={<PropertyIcon name="xCom" />}
                                    value={nextData.x}
                                />
                            </li>
                            <li>
                                <PropertyDropdown
                                    error={errors?.telegram}
                                    onChange={() => {
                                        resetError('telegram')
                                    }}
                                    onDismiss={() => {
                                        resetError('telegram')
                                    }}
                                    onSubmit={(telegram) => {
                                        resetError('telegram')

                                        validate(() => {
                                            Validator.pick({
                                                telegram: true,
                                            }).parse({ telegram })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            telegram,
                                        }))
                                    }}
                                    submitLabel="Add Telegram link"
                                    title="Add Telegram link"
                                    toggleIcon={
                                        <PropertyIcon
                                            name="telegram"
                                            $color={
                                                nextData.telegram ? '#2aabee' : undefined
                                            }
                                        />
                                    }
                                    value={nextData.telegram}
                                />
                            </li>
                            <li>
                                <PropertyDropdown
                                    error={errors?.reddit}
                                    onChange={() => {
                                        resetError('reddit')
                                    }}
                                    onDismiss={() => {
                                        resetError('reddit')
                                    }}
                                    onSubmit={(reddit) => {
                                        resetError('reddit')

                                        validate(() => {
                                            Validator.pick({
                                                reddit: true,
                                            }).parse({ reddit })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            reddit,
                                        }))
                                    }}
                                    submitLabel="Add Reddit link"
                                    title="Add Reddit link"
                                    toggleIcon={
                                        <PropertyIcon
                                            name="reddit"
                                            $color={
                                                nextData.reddit ? '#ff5700' : undefined
                                            }
                                        />
                                    }
                                    value={nextData.reddit}
                                />
                            </li>
                            <li>
                                <PropertyDropdown
                                    error={errors?.linkedIn}
                                    onChange={() => {
                                        resetError('linkedIn')
                                    }}
                                    onDismiss={() => {
                                        resetError('linkedIn')
                                    }}
                                    onSubmit={(linkedIn) => {
                                        resetError('linkedIn')

                                        validate(() => {
                                            Validator.pick({
                                                linkedIn: true,
                                            }).parse({ linkedIn })
                                        })

                                        updateNextData((c) => ({
                                            ...c,
                                            linkedIn,
                                        }))
                                    }}
                                    submitLabel="Add LinkedIn link"
                                    title="Add LinkedIn link"
                                    toggleIcon={
                                        <PropertyIcon
                                            name="linkedin"
                                            $color={
                                                nextData.linkedIn ? '#0077b5' : undefined
                                            }
                                        />
                                    }
                                    value={nextData.linkedIn}
                                />
                            </li>
                        </PropertyDropdownList>
                    </AboutOperatorField>
                    <AboutOperatorField>
                        <Label $wrap>Operator Avatar</Label>
                        <FieldWrap>
                            <AvatarField>
                                <AvatarDisplayContainer>
                                    {imageBlob ? (
                                        <OperatorAvatar
                                            src={imageBlob}
                                            crossOrigin={getImageCrossOrigin(imageBlob)}
                                        />
                                    ) : (
                                        <AvatarPlaceholder username={randomAddress} />
                                    )}
                                </AvatarDisplayContainer>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            void (async () => {
                                                if (!e.target.files?.length) {
                                                    return
                                                }

                                                try {
                                                    const imageToUpload =
                                                        await cropModal.pop({
                                                            imageUrl: URL.createObjectURL(
                                                                e.target.files[0],
                                                            ),
                                                            mask: 'round',
                                                        })

                                                    updateNextData((c) => ({
                                                        ...c,
                                                        imageToUpload,
                                                    }))
                                                } catch (e) {
                                                    if (isRejectionReason(e)) {
                                                        return
                                                    }

                                                    throw e
                                                }
                                            })()
                                        }}
                                    />
                                    <Button
                                        kind="secondary"
                                        size="normal"
                                        type="button"
                                        onClick={() => {
                                            fileInputRef.current?.click()
                                        }}
                                    >
                                        <ButtonIcon name="plus" />
                                        Upload Avatar
                                    </Button>
                                    <AvatarRequirements>
                                        <li>JPEG or PNG format only</li>
                                    </AvatarRequirements>
                                </div>
                            </AvatarField>
                        </FieldWrap>
                    </AboutOperatorField>
                </Section>
            </AboutOperator>
        </FormModal>
    )
}

export const operatorModal = toaster(OperatorModal, Layer.Modal)

const AboutOperator = styled.div`
    margin-top: 40px;
`

const AboutOperatorField = styled.div`
    margin-top: 16px;

    ${PropertyDropdownList} {
        margin-top: 16px;
    }
`

const AvatarField = styled.div`
    padding: 20px;
    width: 100%;

    button {
        width: 100%;
    }

    @media ${TABLET} {
        display: flex;

        button {
            width: auto;
        }
    }
`

const AvatarDisplayContainer = styled.div`
    margin: 0 auto 16px;
    width: max-content;

    @media ${TABLET} {
        margin: 0 32px 0 0;
    }
`

const AvatarImageStyles = css`
    width: 80px;
    height: 80px;
    border: 1px solid ${COLORS.secondaryHover};
    border-radius: 100%;
`

const AvatarPlaceholder = styled(AvatarImage)`
    ${AvatarImageStyles}
`

const OperatorAvatar = styled.img`
    ${AvatarImageStyles}
`

const AvatarRequirements = styled.ul`
    color: #555;
    font-size: 12px;
    list-style-position: inside;
    margin: 10px 0 0;
    padding: 0;
    text-align: center;
`

const ButtonIcon = styled(SvgIcon)`
    width: 12px;
    height: 12px;
    margin-right: 8px;
`

const AlertContainer = styled.div`
    margin-top: 10px;
`
