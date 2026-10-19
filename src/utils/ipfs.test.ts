import {
    getImageCrossOrigin,
    getIpfsCidFromUrl,
    getIpfsGatewayUrl,
    isIpfsGatewayUrl,
} from './ipfs'

describe('ipfs utils', () => {
    const env = { ...process.env }

    afterEach(() => {
        process.env = { ...env }
    })

    describe('getIpfsGatewayUrl', () => {
        it('falls back to the public Pinata gateway', () => {
            delete process.env.PINATA_GATEWAY_URL

            expect(getIpfsGatewayUrl('Qm123')).toEqual(
                'https://gateway.pinata.cloud/ipfs/Qm123',
            )
        })

        it('uses the configured gateway and normalizes the trailing slash', () => {
            process.env.PINATA_GATEWAY_URL = 'https://example.mypinata.cloud/ipfs'

            expect(getIpfsGatewayUrl('Qm123')).toEqual(
                'https://example.mypinata.cloud/ipfs/Qm123',
            )

            process.env.PINATA_GATEWAY_URL = 'https://example.mypinata.cloud/ipfs/'

            expect(getIpfsGatewayUrl('Qm123')).toEqual(
                'https://example.mypinata.cloud/ipfs/Qm123',
            )
        })
    })

    describe('isIpfsGatewayUrl / getImageCrossOrigin', () => {
        beforeEach(() => {
            process.env.PINATA_GATEWAY_URL = 'https://example.mypinata.cloud/ipfs/'
        })

        it('recognizes gateway URLs', () => {
            const url = getIpfsGatewayUrl('Qm123')

            expect(isIpfsGatewayUrl(url)).toBe(true)

            expect(getImageCrossOrigin(url)).toEqual('anonymous')
        })

        it('leaves other URLs alone', () => {
            for (const url of [
                'https://example.com/image.png',
                'https://ipfs.io/ipfs/Qm123',
                'blob:http://localhost:3333/0b2c5e52',
                '',
                undefined,
                null,
            ]) {
                expect(isIpfsGatewayUrl(url)).toBe(false)

                expect(getImageCrossOrigin(url)).toBeUndefined()
            }
        })
    })

    describe('getIpfsCidFromUrl', () => {
        it('extracts CIDs from gateway and ipfs:// URLs', () => {
            expect(getIpfsCidFromUrl('https://ipfs.io/ipfs/Qm123')).toEqual('Qm123')

            expect(
                getIpfsCidFromUrl('https://streamr-hub.infura-ipfs.io/ipfs/Qm123?x=1'),
            ).toEqual('Qm123')

            expect(getIpfsCidFromUrl('ipfs://bafy123/file.png')).toEqual('bafy123')
        })

        it('returns undefined for non-IPFS URLs', () => {
            expect(getIpfsCidFromUrl('https://example.com/image.png')).toBeUndefined()

            expect(getIpfsCidFromUrl('')).toBeUndefined()
        })
    })
})
