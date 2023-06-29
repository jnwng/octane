import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// import env from '../src/env';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletContextProvider: FC<any> = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const network = process.env.NEXT_PUBLIC_RPC_URL!;
    const walletAdapterNetwork = network.includes('mainnet')
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => network, [network]);
    const wallets = useMemo(
        () => [
            new WalletConnectWalletAdapter({
                network: walletAdapterNetwork,
                options: {
                    relayUrl: 'wss://relay.walletconnect.com',
                    // example WC app project ID
                    projectId: 'f1559cce010fd0ba641c3e6e02ca3aa4',
                    metadata: {
                        name: 'Example App',
                        description: 'Example App',
                        url: 'https://github.com/solana-labs/wallet-adapter',
                        icons: ['https://avatars.githubusercontent.com/u/35608259?s=200'],
                    },
                },
            }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={false}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return <WalletContextProvider>{children}</WalletContextProvider>;
};
