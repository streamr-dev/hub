import { z } from 'zod'
import { post } from '~/shared/utils/api'
import { PINATA_UPLOAD_ENDPOINT, getPinataJwt } from '~/utils/ipfs'

const UploadResponse = z.object({
    data: z.object({
        cid: z.string().min(1),
    }),
})

/**
 * Uploads an image to the public IPFS network via Pinata.
 * @returns The CID of the uploaded file.
 */
export async function postImage(image: File): Promise<string> {
    const jwt = getPinataJwt()

    if (!jwt) {
        throw new Error('Image upload is not configured (missing PINATA_JWT)')
    }

    const data = new FormData()

    data.append('file', image, image.name)

    data.append('network', 'public')

    const uploadResult = await post({
        url: PINATA_UPLOAD_ENDPOINT,
        options: {
            headers: {
                /**
                 * Overrides the default `application/json` so axios keeps the
                 * FormData intact (the browser fills in the actual boundary).
                 */
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${jwt}`,
            },
        },
        data,
    })

    return UploadResponse.parse(uploadResult).data.cid
}
