// Copyright 2019-2022 @subwallet/wallet-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {getWalletBySource, isWalletInstalled} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import {EvmWallet, Wallet, WalletAccount} from '@subwallet/wallet-connect/types';
import React, {useCallback, useContext, useEffect, useState} from "react";
import {SELECT_WALLET_MODAL_ID} from "../components/Modal/Wallet/SelectWalletModal";
import {ModalContext} from "@subwallet/react-ui";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {openLink, windowReload} from "../utils/window";
import {isMobile} from "../utils/environment";
import ConnectErrorModal, {SELECT_WALLET_MODAL_ERROR_ID} from "../components/Modal/Wallet/ConnectErrorModal";

export interface WalletContextInterface {
    wallet?: Wallet,
    evmWallet?: EvmWallet,
    accounts: WalletAccount[],
    setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate' | 'evm') => void
    walletType: 'substrate' | 'evm';
    signMessage: (address: string, message: string) => Promise<string | null>,
    disconnectAccount: () => void,
    setCurrentAddress: (address: string) => void,
    setWalletAccount: (accountData: WalletAccount) => void,
    walletAccount: WalletAccount,
    currentSignature?: string
    setCurrentSignature: (address: string) => void,
}

export const WalletContext = React.createContext<WalletContextInterface>({
    accounts: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setWallet: (wallet, walletType: 'substrate' | 'evm') => {
    },
    signMessage: async (address: string, message: string) => {
        return null;
    },
    walletType: 'substrate',
    disconnectAccount: () => {
    },
    setCurrentAddress: (address: string) => {
    },
    setWalletAccount: (accountData: WalletAccount) => {
    },
    walletAccount: undefined as unknown as WalletAccount,

    currentSignature: '',
    setCurrentSignature: (address: string) => {},
});

interface OpenSelectWalletInterface {
    isOpen: boolean,
    open: () => void
    close: () => void
}

export const OpenSelectWallet = React.createContext<OpenSelectWalletInterface>({
    isOpen: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    open: () => {
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: () => {
    }
});


interface Props {
    children: React.ReactElement;
}

export function WalletContextProvider({children}: Props) {

    const [walletKey, setWalletKey] = useLocalStorage('wallet-key');
    const [walletType, setWalletType] = useLocalStorage('wallet-type', 'substrate');
    const {activeModal, inactiveModal} = useContext(ModalContext);
    const [currentSignature, setCurrentSignature] = useLocalStorage('currentsignature');
    const [currentAddress, setCurrentAddress] = useLocalStorage('currentAddress');
    const [walletAccount, setWalletAccount] = useState<WalletAccount | undefined>(undefined);
    const [currentWallet, setCurrentWallet] = useState<Wallet | EvmWallet | undefined>(getWalletBySource(walletKey));
    const [isSelectWallet, setIsSelectWallet] = useState(false);
    const [accounts, setAccounts] = useState<WalletAccount[]>([]);

    const afterSelectWallet = useCallback(
        async (wallet: Wallet) => {
            const infos = await wallet.getAccounts();
            setCurrentWallet(wallet);
            infos && setAccounts(infos);
        },
        []
    );

    const selectWallet = useCallback(
        async (wallet: Wallet) => {
            try {
                setCurrentWallet(currentWallet);
                // @ts-ignore
                if (wallet.rawExtension){
                    // @ts-ignore
                    await wallet.rawExtension.enable();
                }else {
                    await wallet.enable();
                }
                setWalletKey(wallet.extensionName);
                await afterSelectWallet(wallet);
            }catch (e) {
                console.log(e)
                activeModal(SELECT_WALLET_MODAL_ERROR_ID);
            }
        },
        [afterSelectWallet, currentWallet, setWalletKey]
    );

    const afterSelectEvmWallet = useCallback(
        async (wallet: EvmWallet) => {
            await wallet?.enable(); // Quick call extension?.request({ method: 'eth_requestAccounts' });
        },
        []
    );

    const selectEvmWallet = useCallback(
        async (wallet: EvmWallet) => {
            await afterSelectEvmWallet(wallet);

            setCurrentWallet(currentWallet);

            setWalletKey(wallet.extensionName);
            //
            windowReload();
        },
        [afterSelectEvmWallet, currentWallet, setWalletKey]
    );


    const signMessage = useCallback(async (address: string, message: string): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            if (!currentWallet) {
                return null;
            }

            if (walletType === 'evm') {
                (currentWallet as EvmWallet).request({
                    method: 'personal_sign',
                    params: [message, address]
                }).then(rs => {
                    resolve(rs as unknown as string);
                }).catch(reject);
            } else {
                (currentWallet as Wallet).signer?.signRaw?.({
                    address: address,
                    type: 'payload',
                    data: message
                }).then(rs => {
                    resolve(rs.signature);
                }).catch(reject);
            }
        });
    }, [currentWallet, walletType]);


    // Update when current account change
    const _setCurrentAddress = useCallback((address: string) => {
        if (address !== currentAddress) {
            setCurrentAddress(address);
            setCurrentSignature('')
        }
    }, [currentAddress, setCurrentAddress, setCurrentSignature]);

    // Auto select wallet account by current address
    useEffect(() => {
        const walletAccounts = accounts;
        let walletAccount: WalletAccount | undefined;

        // Check currentAddress with wallet accounts list
        if (currentAddress) {
            walletAccount = walletAccounts.find((a) => (a.address === currentAddress))
            if (walletAccount) {
                setWalletAccount(walletAccount);
            }
        }
        if (!walletAccount && walletAccounts.length > 0) {
            setCurrentAddress(walletAccounts[0].address);
            setWalletAccount(walletAccounts[0]);
        }
    }, [currentAddress, accounts, setCurrentAddress]);

    const walletContext = {
        wallet: getWalletBySource('walletKey'),
        evmWallet: getEvmWalletBySource('walletKey'),
        accounts,
        setWallet: (wallet: Wallet | EvmWallet | undefined, walletType: 'substrate' | 'evm') => {
            if (walletType === 'substrate') {
                wallet && selectWallet(wallet as Wallet)
            } else {
                wallet && selectEvmWallet(wallet as EvmWallet);
            }

            wallet && setWalletType(walletType);
        },
        signMessage,
        walletType: 'substrate',
        setCurrentAddress: _setCurrentAddress,
        setWalletAccount: setWalletAccount,
        walletAccount: walletAccount,
        currentSignature,
        setCurrentSignature,
        disconnectAccount: () => {
            window.localStorage.clear();
            windowReload();
        }
    };

    const selectWalletContext = {
        isOpen: isSelectWallet,
        open: () => {
            if (isMobile) {
                if (isWalletInstalled('subwallet-js')) {
                    const subwallet = getWalletBySource('subwallet-js');
                    if (subwallet) {
                        setIsSelectWallet(true);
                        selectWallet(subwallet)
                            .catch(console.error)
                            .finally(() => {
                                setIsSelectWallet(false);
                            });
                    }
                } else {
                    const encodedURL = encodeURI(window.location.href);

                    openLink(`https://mobile.subwallet.app/browser?url=${encodedURL}`);
                }
            } else {
                activeModal(SELECT_WALLET_MODAL_ID);
                setIsSelectWallet(true);
            }
        },
        close: () => {
            inactiveModal(SELECT_WALLET_MODAL_ID);
            setIsSelectWallet(false);
        }
    };

    useEffect(
        () => {
            if (walletType === 'substrate') {
                const wallet = getWalletBySource(walletKey);

                setTimeout(() => {
                    if (wallet && wallet?.installed) {
                        // eslint-disable-next-line no-void
                        void afterSelectWallet(wallet);
                    }
                }, 150);
            } else {
                const evmWallet = getEvmWalletBySource(walletKey);

                evmWallet && evmWallet?.isReady.then(() => {
                    afterSelectEvmWallet(evmWallet).catch(console.error);
                });
            }
        },
        [afterSelectEvmWallet, afterSelectWallet, walletKey, walletType]
    );


    return <WalletContext.Provider value={walletContext as WalletContextInterface}>
        <OpenSelectWallet.Provider value={selectWalletContext}>
            {children}
            <ConnectErrorModal/>
        </OpenSelectWallet.Provider>
    </WalletContext.Provider>;
}
