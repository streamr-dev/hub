import { Chain } from '@streamr/config'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { z } from 'zod'
import { Button } from '~/components/Button'
import ColoredBox from '~/components/ColoredBox'
import Layout, {
    LayoutColumn,
    LayoutInner as PrestyledLayoutInner,
} from '~/components/Layout'
import { SegmentGrid } from '~/components/NetworkPageSegment'
import BeneficiaryAddressEditor from '~/components/SalePointSelector/BeneficiaryAddressEditor'
import SalePointOption, {
    DataUnionOption,
} from '~/components/SalePointSelector/SalePointOption'
import SalePointTokenSelector from '~/components/SalePointSelector/SalePointTokenSelector'
import { getProjectTypeTitle } from '~/getters'
import ProjectLinkTabs from '~/pages/ProjectPage/ProjectLinkTabs'
import TermsOfUse from '~/pages/ProjectPage/TermsOfUse'
import { deleteProject } from '~/services/projects'
import { DetailsPageHeader } from '~/shared/components/DetailsPageHeader'
import LoadingIndicator from '~/shared/components/LoadingIndicator'
import useIsMounted from '~/shared/hooks/useIsMounted'
import { ProjectType, SalePoint } from '~/shared/types'
import { ProjectDraft } from '~/stores/projectDraft'
import { SalePointsPayload } from '~/types/projects'
import { formatChainName } from '~/utils'
import {
    getChainConfig,
    getChainConfigExtension,
    useCurrentChainId,
} from '~/utils/chains'
import { Route as R, routeOptions } from '~/utils/routes'
import { toastedOperation } from '~/utils/toastedOperation'
import DataUnionFee from './DataUnionFee'
import DataUnionPayment from './DataUnionPayment'
import EditorHero from './EditorHero'
import EditorNav from './EditorNav'
import EditorStreams from './EditorStreams'

const EmptySalePoints = {}

const EmptyErrors = {}

export default function ProjectEditorPage() {
    const {
        id: projectId,
        type = ProjectType.OpenData,
        creator = '',
        salePoints: existingSalePoints = EmptySalePoints,
    } = ProjectDraft.useEntity({ hot: true }) || {}

    const busy = ProjectDraft.useIsDraftBusy()

    const { fetching = false, errors = EmptyErrors } = ProjectDraft.useDraft() || {}

    const update = ProjectDraft.useUpdateEntity()

    const chainId = useCurrentChainId()

    const availableChains = useMemo<Chain[]>(
        () => getChainConfigExtension(chainId).marketplaceChains.map(getChainConfig),
        [chainId],
    )

    const salePoints = availableChains
        .map<SalePoint | undefined>(
            ({ name: chainName }) => existingSalePoints[chainName],
        )
        .filter(Boolean) as SalePoint[]

    function onSalePointChange(value: SalePoint) {
        if (busy) {
            return
        }

        update((draft) => {
            const { name: chainName } = getChainConfig(value.chainId)

            if (draft.salePoints[chainName]?.readOnly) {
                /**
                 * Read-only sale point must not be updated.
                 */
                return
            }

            draft.salePoints[chainName] = value

            if (draft.type !== ProjectType.DataUnion) {
                return
            }

            if (value.enabled) {
                /**
                 * Disable all other sale points making the current one the sole
                 * selection. We're mimicing radio's behaviour here.
                 */
                Object.values(draft.salePoints).forEach((salePoint) => {
                    if (!salePoint?.enabled || salePoint.chainId === value.chainId) {
                        return
                    }

                    salePoint.enabled = false
                })
            }
        })
    }

    const setErrors = ProjectDraft.useSetDraftErrors()

    const isMounted = useIsMounted()

    const navigate = useNavigate()

    return (
        <Layout
            innerComponent={LayoutInner}
            nav={<EditorNav />}
            pageTitle={projectId ? 'Edit project' : 'Create a new project'}
        >
            <DetailsPageHeader
                pageTitle={
                    !!creator && (
                        <>
                            {getProjectTypeTitle(type)} by
                            <strong>&nbsp;{creator}</strong>
                        </>
                    )
                }
                rightComponent={<ProjectLinkTabs />}
            />
            <LoadingIndicator loading={busy} />
            <LayoutColumn>
                {!fetching && (
                    <SegmentGrid>
                        <Segment>
                            <EditorHero />
                        </Segment>
                        {type === ProjectType.PaidData && (
                            <Segment>
                                <ColoredBox $pad>
                                    <Content>
                                        <h2>Select chains</h2>
                                        <p>
                                            Access to the project data can be purchased on
                                            the selected chains. You can set the payment
                                            token, price, and beneficiary address on each
                                            chain separately.
                                        </p>
                                    </Content>
                                    <Content $desktopMaxWidth={728}>
                                        {salePoints.map((salePoint) => {
                                            const chainName = getChainConfig(
                                                salePoint.chainId,
                                            ).name

                                            const formattedChainName =
                                                formatChainName(chainName)

                                            const beneficiaryErrorKey = `salePoints.${chainName}.beneficiaryAddress`

                                            const beneficiaryInvalid =
                                                !!errors[beneficiaryErrorKey]

                                            return (
                                                <SalePointOption
                                                    key={salePoint.chainId}
                                                    multiSelect
                                                    onSalePointChange={onSalePointChange}
                                                    salePoint={salePoint}
                                                >
                                                    <h4>
                                                        Set the payment token and price on
                                                        the {formattedChainName} chain
                                                    </h4>
                                                    <p>
                                                        You can set a price for others to
                                                        access the streams in your
                                                        project. The price can be set in
                                                        DATA or any other ERC-20 token.
                                                    </p>
                                                    <SalePointTokenSelector
                                                        disabled={salePoint.readOnly}
                                                        onSalePointChange={
                                                            onSalePointChange
                                                        }
                                                        salePoint={salePoint}
                                                    />
                                                    <h4>Set beneficiary</h4>
                                                    <p>
                                                        This wallet address receives the
                                                        payments for this product on{' '}
                                                        {formattedChainName} chain.
                                                    </p>
                                                    <BeneficiaryAddressEditor
                                                        invalid={beneficiaryInvalid}
                                                        disabled={
                                                            busy || salePoint.readOnly
                                                        }
                                                        value={
                                                            salePoint.beneficiaryAddress
                                                        }
                                                        onChange={(
                                                            beneficiaryAddress,
                                                        ) => {
                                                            const newSalePoint = {
                                                                ...salePoint,
                                                                beneficiaryAddress,
                                                            }

                                                            onSalePointChange?.(
                                                                newSalePoint,
                                                            )

                                                            /**
                                                             * If the field is valid we skip on-the-fly validation assuming
                                                             * correct user input at first.
                                                             */
                                                            if (!beneficiaryInvalid) {
                                                                return
                                                            }

                                                            try {
                                                                try {
                                                                    SalePointsPayload.parse(
                                                                        {
                                                                            [chainName]:
                                                                                newSalePoint,
                                                                        },
                                                                    )
                                                                } catch (e) {
                                                                    if (
                                                                        !(
                                                                            e instanceof
                                                                            z.ZodError
                                                                        )
                                                                    ) {
                                                                        throw e
                                                                    }

                                                                    const issues =
                                                                        e.issues.filter(
                                                                            ({ path }) =>
                                                                                path.slice(
                                                                                    -1,
                                                                                )[0] ===
                                                                                'beneficiaryAddress',
                                                                        )

                                                                    if (issues.length) {
                                                                        throw new z.ZodError(
                                                                            issues,
                                                                        )
                                                                    }
                                                                }

                                                                setErrors((errors0) => {
                                                                    delete errors0[
                                                                        beneficiaryErrorKey
                                                                    ]
                                                                })
                                                            } catch (e) {
                                                                if (
                                                                    e instanceof
                                                                    z.ZodError
                                                                ) {
                                                                    return
                                                                }

                                                                console.warn(
                                                                    'Failed to validate beneficiary address',
                                                                    e,
                                                                )
                                                            }
                                                        }}
                                                    />
                                                </SalePointOption>
                                            )
                                        })}
                                    </Content>
                                </ColoredBox>
                            </Segment>
                        )}
                        {type === ProjectType.DataUnion && (
                            <DataUnionPayment>
                                {(salePoint) => (
                                    <>
                                        {!projectId && (
                                            <Segment>
                                                <ColoredBox $pad>
                                                    <Content>
                                                        <h2>Select chain</h2>
                                                        <p>
                                                            Select the chain for your Data
                                                            Union.
                                                        </p>
                                                    </Content>
                                                    <Content $desktopMaxWidth={728}>
                                                        {salePoints.map((salePoint) => (
                                                            <SalePointOption
                                                                key={salePoint.chainId}
                                                                onSalePointChange={
                                                                    onSalePointChange
                                                                }
                                                                salePoint={salePoint}
                                                            >
                                                                <DataUnionOption
                                                                    salePoint={salePoint}
                                                                    onSalePointChange={
                                                                        onSalePointChange
                                                                    }
                                                                />
                                                            </SalePointOption>
                                                        ))}
                                                    </Content>
                                                </ColoredBox>
                                            </Segment>
                                        )}
                                        <Segment>
                                            <ColoredBox $pad>
                                                <Content>
                                                    <h2>
                                                        {salePoint ? (
                                                            <>
                                                                Set the payment token and
                                                                price on&nbsp;the&nbsp;
                                                                {formatChainName(
                                                                    getChainConfig(
                                                                        salePoint.chainId,
                                                                    ).name,
                                                                )}{' '}
                                                                chain
                                                            </>
                                                        ) : (
                                                            <>
                                                                Set the payment token and
                                                                price
                                                            </>
                                                        )}
                                                    </h2>
                                                    <p>
                                                        You can set a price for others to
                                                        access the streams in your
                                                        project. The price can be set in
                                                        DATA or any other ERC-20 token.
                                                    </p>
                                                </Content>
                                                {salePoint ? (
                                                    <Content $desktopMaxWidth={728}>
                                                        <SalePointTokenSelector
                                                            disabled={salePoint.readOnly}
                                                            salePoint={salePoint}
                                                            onSalePointChange={
                                                                onSalePointChange
                                                            }
                                                        />
                                                    </Content>
                                                ) : (
                                                    <>Select a chain first!</>
                                                )}
                                            </ColoredBox>
                                        </Segment>
                                        {!projectId && salePoint?.beneficiaryAddress ? (
                                            <>{/* Indentation fix. */}</>
                                        ) : (
                                            <Segment>
                                                <ColoredBox $pad>
                                                    <Content>
                                                        <h2>Data Union admin fee</h2>
                                                    </Content>
                                                    <Content $desktopMaxWidth={728}>
                                                        <DataUnionFee />
                                                    </Content>
                                                </ColoredBox>
                                            </Segment>
                                        )}
                                    </>
                                )}
                            </DataUnionPayment>
                        )}
                        <Segment>
                            <ColoredBox $pad>
                                <Content>
                                    <h2>Add streams</h2>
                                </Content>
                                <EditorStreams />
                            </ColoredBox>
                        </Segment>
                        <Segment>
                            <ColoredBox $pad>
                                <Content>
                                    <h2>Set terms of use</h2>
                                    <p>
                                        Indicate the terms of use you prefer, either
                                        simply, by checking the appropriate boxes below
                                        to&nbsp;show usage types are permitted, or
                                        optionally, give more detail by providing a link
                                        to your own terms of use document.
                                    </p>
                                </Content>
                                <Content $desktopMaxWidth={728}>
                                    <TermsOfUse />
                                </Content>
                            </ColoredBox>
                        </Segment>
                        {projectId && (
                            <Segment>
                                <ColoredBox
                                    $borderColor="#cdcdcd"
                                    $backgroundColor="transparent"
                                    $pad
                                >
                                    <Content>
                                        <h2>Delete project</h2>
                                        <p>
                                            Delete this project forever. You can&apos;t
                                            undo this.
                                        </p>
                                    </Content>
                                    <Button
                                        kind="destructive"
                                        onClick={async () => {
                                            try {
                                                await toastedOperation(
                                                    'Delete project',
                                                    () =>
                                                        deleteProject(chainId, projectId),
                                                )

                                                if (!isMounted()) {
                                                    return
                                                }

                                                navigate(
                                                    R.projects(routeOptions(chainId)),
                                                )
                                            } catch (e) {
                                                console.warn(
                                                    'Failed to delete a project',
                                                    e,
                                                )
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </ColoredBox>
                            </Segment>
                        )}
                    </SegmentGrid>
                )}
            </LayoutColumn>
        </Layout>
    )
}

const Segment = styled.div`
    h2 {
        font-size: 34px;
        font-weight: 400;
        line-height: 1.5em;
        margin: 0 0 28px;
    }

    h2 + p {
        font-size: 16px;
        margin-bottom: 40px;
    }
`

const Content = styled.div<{ $desktopMaxWidth?: number }>`
    ${({ $desktopMaxWidth = 678 }) => css`
        @media (min-width: ${$desktopMaxWidth + 64}px) {
            max-width: ${$desktopMaxWidth}px;
        }
    `}
`

const LayoutInner = styled(PrestyledLayoutInner)`
    width: 100%;
    overflow: hidden;
`
