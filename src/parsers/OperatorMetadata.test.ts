import { OperatorMetadata } from './OperatorMetadata'

function parse(raw: unknown) {
    return OperatorMetadata.parse(raw, 137)
}

const emptyMetadata = {
    name: '',
    description: '',
    url: '',
    email: '',
    twitter: '',
    x: '',
    telegram: '',
    reddit: '',
    linkedIn: '',
}

describe('Operator metadata parsing', () => {
    it('parses undefined', () => {
        expect(parse(undefined)).toMatchObject(emptyMetadata)
    })

    it('parses nulls to an empty metadata', () => {
        expect(parse(null)).toMatchObject(emptyMetadata)
    })

    it('parses numbers to an empty metadata', () => {
        expect(parse(1)).toMatchObject(emptyMetadata)
    })

    it('parses undefined to an empty metadata', () => {
        expect(parse('abc')).toMatchObject(emptyMetadata)
    })

    it('parses an empty JSON object to an empty metadata', () => {
        expect(parse('{}')).toMatchObject(emptyMetadata)
    })

    it('parses a record into some metadata', () => {
        expect(parse({ name: 'FOO' })).toMatchObject({
            name: 'FOO',
        })

        expect(parse({ bar: 'BAR' })).toMatchObject({
            name: '',
        })
    })

    it('parses a JSON object with invalid urls', () => {
        expect(
            parse(
                JSON.stringify({
                    name: 'NAME',
                    description: 'DESCRIPTION',
                    url: 'URL',
                    email: 'EMAIL',
                    twitter: 'TWITTER',
                    x: 'X',
                    telegram: 'TELEGRAM',
                    reddit: 'REDDIT',
                    linkedIn: 'LINKEDIN',
                    imageIpfsCid: 'foobar',
                    redundancyFactor: 2,
                }),
            ),
        ).toMatchObject({
            name: 'NAME',
            description: 'DESCRIPTION',
            url: '',
            email: '',
            twitter: '',
            x: '',
            telegram: '',
            reddit: '',
            linkedIn: '',
            imageIpfsCid: 'foobar',
            redundancyFactor: 2,
        })
    })

    it('parses valid payload', () => {
        const valid = {
            name: 'NAME',
            description: 'DESCRIPTION',
            url: 'https://streamr.network/',
            email: 'contact@streamr.network',
            twitter: 'https://twitter.com/stream',
            x: 'https://x.com/streamr',
            telegram: 'https://telegram.org/blablabla',
            reddit: 'https://reddit.com/u/foobar',
            linkedIn: 'https://linkedin.com/streamr',
            imageIpfsCid: 'foobar',
            redundancyFactor: 2,
        }

        expect(parse(JSON.stringify(valid))).toMatchObject(valid)

        expect(parse({ name: 'NAME' })).toMatchObject({
            name: 'NAME',
            imageIpfsCid: undefined,
            imageUrl: undefined,
        })
    })

    it('extracts proper image URL', () => {
        const env = { ...process.env }

        process.env.PINATA_GATEWAY_URL = 'https://example.mypinata.cloud/ipfs/'

        try {
            expect(parse({ imageIpfsCid: 'foo' })).toMatchObject({
                imageIpfsCid: 'foo',
                imageUrl: 'https://example.mypinata.cloud/ipfs/foo',
            })
        } finally {
            process.env = env
        }
    })
})
