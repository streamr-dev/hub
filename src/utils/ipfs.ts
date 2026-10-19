/**
 * IPFS is served through Pinata (https://pinata.cloud).
 *
 * - `PINATA_GATEWAY_URL` – base URL of the dedicated gateway, e.g.
 *   `https://example-gateway.mypinata.cloud/ipfs/`. Falls back to Pinata's
 *   public (rate-limited) gateway when unset.
 * - `PINATA_JWT` – API key JWT used for uploads (see `~/services/images`).
 *
 * The dedicated gateway is expected to be protected with a Host Origin access
 * control. That check relies on the `Origin` request header, which browsers
 * only send for CORS requests, so every `<img>` that loads from the gateway
 * must carry `crossOrigin="anonymous"` – see `getImageCrossOrigin`.
 */

const DEFAULT_PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/'

export const PINATA_UPLOAD_ENDPOINT = 'https://uploads.pinata.cloud/v3/files'

export function getPinataJwt(): string {
    return process.env.PINATA_JWT || ''
}

function getIpfsGatewayBaseUrl(): string {
    const url = process.env.PINATA_GATEWAY_URL || DEFAULT_PINATA_GATEWAY_URL

    return url.endsWith('/') ? url : `${url}/`
}

/**
 * Builds a gateway URL for the given IPFS CID.
 */
export function getIpfsGatewayUrl(cid: string): string {
    return `${getIpfsGatewayBaseUrl()}${cid}`
}

/**
 * Tells if the given URL points at our IPFS gateway.
 */
export function isIpfsGatewayUrl(url: string | null | undefined): boolean {
    return !!url && url.startsWith(getIpfsGatewayBaseUrl())
}

/**
 * Returns the `crossOrigin` attribute value an `<img>` should use for the
 * given `src`. Gateway images are loaded as CORS requests (so the Host Origin
 * access control sees the `Origin` header); anything else (blob URLs, third
 * party hosts that may not send CORS headers) is left alone.
 */
export function getImageCrossOrigin(
    src: string | null | undefined,
): 'anonymous' | undefined {
    return isIpfsGatewayUrl(src) ? 'anonymous' : undefined
}

/**
 * Extracts the CID from an `ipfs://<cid>` or `https://<gateway>/ipfs/<cid>` URL.
 * Returns `undefined` for anything else.
 */
export function getIpfsCidFromUrl(url: string): string | undefined {
    const match = /^(?:ipfs:\/\/|https?:\/\/[^/]+\/ipfs\/)([^/?#]+)/.exec(url)

    return match?.[1]
}
