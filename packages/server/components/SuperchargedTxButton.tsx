import React from 'react';
import * as web3 from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react'

export const SuperchargedTxButton = () => {

  const { signTransaction, publicKey: userPublicKey } = useWallet();

  const handleButtonClick = async () => {
    try {
      // Fetch public key from the server
      const response = await fetch('/api/get-fee-payer');
      const data = await response.json();
      const publicKey = new web3.PublicKey(data.publicKey);

      // Create connection to the Solana cluster
      const connection = new web3.Connection(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.NEXT_PUBLIC_RPC_URL!,
        'confirmed'
      );

      // Construct the transaction
      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fromPubkey: userPublicKey!,
          toPubkey: new web3.PublicKey('HSxvoc5mZ79fKXRQdMY55KdgLjFmbMFk7wPi299eA25h'), // Set the destination public key to your preference
          lamports: 1_000_000 // Set the amount to your preference
        })
      );

      // Set the transaction's feePayer to the Supercharger public key
      // Typically this would be scoped based on the organization they're authorized to use
      transaction.feePayer = publicKey;

      // TODO(jon): Remove this blockhash
      // We're going to elide the recentBlockhash, because we don't want the timer to start yet.
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      // Assign recent blockhash to the transaction
      transaction.recentBlockhash = blockhash;

      // Typically at this point, we would send to MPC wallet for signing
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const userSignedTx = await signTransaction!(transaction)

      // This whole part should really be done by MPC wallet. But we can do it here too.
      // TODO(jon): Figure out if they want to use a hosted service or push to MPC wallet

      // Serialize the transaction to base64
      const serializedTx = userSignedTx.serialize({ requireAllSignatures: false }).toString('base64');

      // POST the serialized transaction to your desired endpoint
      const responseTx = await fetch('/api/supercharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction: serializedTx }),
      });

      const { transaction: signedTx } = await responseTx.json();

      console.info({ signedTx })
      const txSig = await connection.sendRawTransaction(Buffer.from(signedTx, 'base64'));
      console.info({ txSig })

      await connection.confirmTransaction({ signature: txSig, blockhash, lastValidBlockHeight })

      console.log(transaction);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <button onClick={handleButtonClick}>
      Get Public Key and Construct Transaction
    </button>
  );
};
