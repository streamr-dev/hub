import { z } from 'zod'
import { ParseError } from '~/errors'
import { Parsable } from '~/parsers/Parsable'
import { getIpfsGatewayUrl } from '~/utils/ipfs'

const RawOperatorMetadata = z
    .union([
        z.string().transform((value) => {
            try {
                return JSON.parse(value)
            } catch (e) {
                if (e instanceof SyntaxError) {
                    return {}
                }

                throw e
            }
        }),
        z.record(z.string(), z.unknown()),
    ])
    .default({})
    .catch({})
    .pipe(
        z.object({
            name: z.unknown(),
            description: z.unknown(),
            imageIpfsCid: z.unknown(),
            redundancyFactor: z.unknown(),
            url: z.unknown(),
            email: z.unknown(),
            twitter: z.unknown(),
            x: z.unknown(),
            telegram: z.unknown(),
            reddit: z.unknown(),
            linkedIn: z.unknown(),
        }),
    )

type RawOperatorMetadata = z.infer<typeof RawOperatorMetadata>

const UrlParser = z
    .string()
    .url()
    .optional()
    .catch(() => '')
    .default('')

export class OperatorMetadata extends Parsable<RawOperatorMetadata> {
    static parse(raw: unknown, chainId: number): OperatorMetadata {
        try {
            return new OperatorMetadata(raw, chainId)
        } catch (e) {
            if (e instanceof z.ZodError) {
                throw new ParseError(raw, e)
            }

            throw e
        }
    }

    protected preparse() {
        return RawOperatorMetadata.parse(this.raw)
    }

    get name() {
        return this.getValue('name', (raw) => {
            return z
                .string()
                .catch(() => '')
                .parse(raw)
        })
    }

    get description() {
        return this.getValue('description', (raw) => {
            return z
                .string()
                .catch(() => '')
                .parse(raw)
        })
    }

    get imageIpfsCid() {
        return this.getValue('imageIpfsCid', (raw) => {
            return z
                .string()
                .trim()
                .optional()
                .catch(() => undefined)
                .transform((v) => v || undefined)
                .parse(raw)
        })
    }

    get imageUrl() {
        const { imageIpfsCid } = this

        return imageIpfsCid && getIpfsGatewayUrl(imageIpfsCid)
    }

    get redundancyFactor() {
        return this.getValue('redundancyFactor', (raw) => {
            return z.coerce
                .number()
                .int()
                .min(1)
                .optional()
                .catch(() => undefined)
                .parse(raw)
        })
    }

    get url() {
        return this.getValue('url', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get email() {
        return this.getValue('email', (raw) => {
            return z
                .string()
                .email()
                .optional()
                .catch(() => '')
                .default('')
                .parse(raw)
        })
    }

    get twitter() {
        return this.getValue('twitter', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get x() {
        return this.getValue('x', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get telegram() {
        return this.getValue('telegram', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get reddit() {
        return this.getValue('reddit', (raw) => {
            return UrlParser.parse(raw)
        })
    }

    get linkedIn() {
        return this.getValue('linkedIn', (raw) => {
            return UrlParser.parse(raw)
        })
    }
}
