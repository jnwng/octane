import type { NextApiRequest, NextApiResponse } from 'next';
import { ENV_SECRET_KEYPAIR, rateLimit } from '../../src';

// Endpoint to get the feePayer to set in the transaction prior to signing
export default async function (request: NextApiRequest, response: NextApiResponse) {
    await rateLimit(request, response);

    const { publicKey } = ENV_SECRET_KEYPAIR;

    response.status(200).send({ publicKey });
}
