import { isAddress } from 'web3-validator'
import { z } from 'zod'
import { address0 } from '~/consts'
import { ProjectType, SalePoint } from '~/shared/types'
import { timeUnits } from '~/shared/utils/timeUnit'
import {
    getChainDisplayName,
    getChainKey,
    getCurrentChain,
    isChainKey,
} from '~/utils/chains'
import { getContractAddress } from '~/utils/contracts'

function getFormattedChainNameFromContext({ path: [, chainKey] }: z.RefinementCtx) {
    const chainName =
        typeof chainKey === 'number'
            ? `#${chainKey}`
            : isChainKey(chainKey)
            ? getChainDisplayName(chainKey)
            : `"${chainKey}"`

    return `for ${chainName} network`
}

export const SalePointsPayload = z.record(
    z.string(),
    z
        .object({
            beneficiaryAddress: z.string().trim(),
            chainId: z.number(),
            enabled: z.boolean(),
            price: z.bigint().gte(0n).or(z.undefined()),
            pricePerSecond: z.bigint().gte(0n).or(z.undefined()),
            pricingTokenAddress: z.string().trim(),
            readOnly: z.boolean(),
            timeUnit: z.union([
                z.literal('second'),
                z.literal('minute'),
                z.literal('hour'),
                z.literal('day'),
                z.literal('week'),
                z.literal('month'),
            ]),
        })
        .superRefine(({ enabled, price, beneficiaryAddress }, ctx) => {
            if (!enabled) {
                return
            }

            if (price == null) {
                return void ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Price ${getFormattedChainNameFromContext(ctx)} is missing`,
                    path: ['price'],
                })
            }

            if (price > 0n || beneficiaryAddress === address0) {
                return
            }

            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Price ${getFormattedChainNameFromContext(
                    ctx,
                )} has to be a positive number`,
                path: ['price'],
            })
        })
        .superRefine(({ enabled, beneficiaryAddress }, ctx) => {
            if (!enabled || !beneficiaryAddress || isAddress(beneficiaryAddress)) {
                return
            }

            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Beneficiary address ${getFormattedChainNameFromContext(
                    ctx,
                )} is not a valid ERC-20 address`,
                path: ['beneficiaryAddress'],
            })
        })
        .superRefine(({ enabled, pricingTokenAddress }, ctx) => {
            if (!enabled) {
                return
            }

            if (!pricingTokenAddress) {
                return void ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Token contract address ${getFormattedChainNameFromContext(
                        ctx,
                    )} is missing`,
                    path: ['pricingTokenAddress'],
                })
            }

            if (isAddress(pricingTokenAddress)) {
                return
            }

            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Token contract address ${getFormattedChainNameFromContext(
                    ctx,
                )} is not a valid ERC-20 address`,
                path: ['pricingTokenAddress'],
            })
        }),
)

export const OpenDataPayload = z.object({
    name: z.string().trim().min(1, { message: 'Product name cannot be empty' }),
    type: z.literal(ProjectType.OpenData),
    description: z.string().trim().min(1, {
        message: 'Product description cannot be empty',
    }),
    creator: z.string().trim().min(1, { message: "Missing or invalid creator's name" }),
    streams: z.array(z.string()).min(1, {
        message: 'No streams selected',
    }),
    imageIpfsCid: z
        .union([z.string(), z.null(), z.undefined()])
        .transform((v) => v || ''),
    imageUrl: z.string().optional(),
    newImageToUpload: z.instanceof(File).optional(),
    termsOfUse: z.object({
        commercialUse: z
            .boolean()
            .optional()
            .transform((v) => v || undefined),
        redistribution: z
            .boolean()
            .optional()
            .transform((v) => v || undefined),
        reselling: z
            .boolean()
            .optional()
            .transform((v) => v || undefined),
        storage: z
            .boolean()
            .optional()
            .transform((v) => v || undefined),
        termsName: z
            .string()
            .trim()
            .optional()
            .transform((v) => v || undefined),
        termsUrl: z
            .string()
            .trim()
            .url('Invalid URL for detailed terms')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
    }),
    contact: z.object({
        url: z
            .string()
            .trim()
            .url('Invalid site URL')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
        email: z
            .string()
            .trim()
            .email('Invalid contact email')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
        twitter: z
            .string()
            .trim()
            .url('Invalid Twitter link')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
        telegram: z
            .string()
            .trim()
            .url('Invalid Telegram link')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
        reddit: z
            .string()
            .trim()
            .url('Invalid Reddit link')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
        linkedIn: z
            .string()
            .trim()
            .url('Invalid LinkedIn link')
            .optional()
            .or(z.literal(''))
            .transform((v) => v || undefined),
    }),
    salePoints: SalePointsPayload.transform(() => {
        const { id: chainId } = getCurrentChain()

        return {
            [getChainKey(chainId)]: {
                beneficiaryAddress: address0,
                chainId,
                enabled: true,
                price: 0n,
                pricePerSecond: 0n,
                pricingTokenAddress: getContractAddress('data', chainId),
                readOnly: true,
                timeUnit: timeUnits.second,
            } satisfies SalePoint,
        }
    }),
})

const DataUnionPayload = OpenDataPayload.merge(
    z.object({
        type: z.literal(ProjectType.DataUnion),
        salePoints: SalePointsPayload.refine(
            (salePoints) => Object.values(salePoints).some(({ enabled }) => enabled),
            {
                message: 'No chains selected',
            },
        ).transform((salePoints) => {
            const [key, value] =
                Object.entries(salePoints).find(([, { enabled }]) => enabled) || []

            return key && value ? { [key]: value } : salePoints
        }),
        adminFee: z
            .string()
            .optional()
            .transform((value, ctx) => {
                const result = Number.parseFloat(value || '0')

                if (Number.isNaN(result)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Admin fee is not a number',
                    })

                    return z.NEVER
                }

                return result
            })
            .pipe(
                z
                    .number()
                    .min(0, 'Admin fee cannot be lower than 0%')
                    .max(100, 'Admin fee cannot be greater than 100%'),
            ),
    }),
)

const PaidDataPayload = OpenDataPayload.merge(
    z.object({
        type: z.literal(ProjectType.PaidData),
        salePoints: SalePointsPayload.refine(
            (salePoints) => Object.values(salePoints).some(({ enabled }) => enabled),
            {
                message: 'No chains selected',
            },
        ).transform((salePoints) => {
            const enabledSalePoints: typeof salePoints = {}

            Object.entries(salePoints).forEach(([key, salePoint]) => {
                if (!salePoint.enabled) {
                    return
                }

                enabledSalePoints[key] = salePoint
            })

            return enabledSalePoints
        }),
    }),
)

export const PublishableProjectPayload = z
    .union([OpenDataPayload, PaidDataPayload, DataUnionPayload])
    .superRefine(({ imageUrl, newImageToUpload }, ctx) => {
        if (imageUrl || newImageToUpload) {
            return
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Cover image is required',
            path: ['imageUrl'],
        })
    })

export type PublishableProjectPayload = z.infer<typeof PublishableProjectPayload>
