import { Transaction } from '@solana/web3.js';
import { cors, rateLimit } from '../../src';
import { NextApiRequest, NextApiResponse } from 'next';
import { ENV_SECRET_KEYPAIR } from '../../src/env';

export default async function (request: NextApiRequest, response: NextApiResponse) {
    await cors(request, response);
    await rateLimit(request, response);

    // This is missing a ton of validation
    // 1. Should not get yourself drained
    // 2. Make sure this has been signed by Fireblocks already
    // 3. Should have a blockhash already (temporarily adding it)

    if (request.method === 'POST') {
        try {
            // Read transaction from request body
            const { transaction } = request.body;

            // Deserialize the transaction
            const deserializedTx = Transaction.from(Buffer.from(transaction, 'base64'));

            // Sign the transaction
            deserializedTx.partialSign(ENV_SECRET_KEYPAIR);

            // Serialize the transaction and convert to base64
            const signedTx = deserializedTx.serialize().toString('base64');

            console.info('we have Supercharged the tx');

            // Return the signed transaction
            response.status(200).json({ transaction: signedTx });
        } catch (error) {
            response.status(500).json({ error: 'Something went wrong' });
        }
    } else {
        // Handle any other HTTP method
        response.setHeader('Allow', ['POST']);
        response.status(405).end(`Method ${request.method} Not Allowed`);
    }
}
