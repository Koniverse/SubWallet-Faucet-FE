// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {getWalletBySource, getWallets} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import React, {useCallback, useContext, useMemo} from 'react';
import {OpenSelectWallet, WalletContext} from "../../../providers/WalletContextProvider";
import {Icon, Image, SettingItem, SwList} from "@subwallet/react-ui";
import {useTranslation} from "react-i18next";
import {Theme, ThemeProps} from "../../../types";
import styled, {useTheme} from "styled-components";
import {DownloadSimple, MagnifyingGlass} from "phosphor-react";
import EmptyList from "../../EmptyList";
import {Wallet} from '@subwallet/wallet-connect/types';
import CN from "classnames";
import {openInNewTab} from "../../../libs";
import {ConnectModal} from "../ConnectModal";
import {isMobile} from "../../../utils/environment";

type ExtensionItemProps = Wallet & {
    type: 'substrate' | 'evm',
    installed: boolean
}
const openLink = function(url: string) {
    window.location.replace(url)
}
const ExtensionItem: React.FC<ExtensionItemProps> = (props: ExtensionItemProps) => {

    const openSelectWalletContext = useContext(OpenSelectWallet);
    const walletContext = useContext(WalletContext);
    const {logo, extensionName, title, installed, installUrl, type} = props;

    const {token} = useTheme() as Theme;

    const leftItemIcon = useMemo(() => {
        const icon = extensionName === 'polkadot-js' ? '/images/polkadot-js.png' : '/images/subwallet-gradient.png';
        return (
            <Image
                height={28}
                src={icon}
                alt={logo.alt}
                width={28}
            />
        );
    }, [logo, extensionName]);
    const onSelectWallet = useCallback(
        (walletKey: string, walletType: 'substrate' | 'evm' = 'substrate') => {
            if (walletType === 'substrate') {
                walletContext.setWallet(getWalletBySource(walletKey), walletType);
                openSelectWalletContext.close();
            } else {
                walletContext.setWallet(getEvmWalletBySource(walletKey), walletType);
                openSelectWalletContext.close();
            }
        },
        [openSelectWalletContext, walletContext]
    );

    const onDownload = useCallback(() => {
        openInNewTab(installUrl)();
    }, [installUrl]);

    const _onClick = useCallback(() => {
        if (!isMobile) {
            if (installed) {
                onSelectWallet(extensionName, type);
                openSelectWalletContext.close()
            } else {
                onDownload();
            }
        }else {
            const link = 'https://mobile.subwallet.app/browser?url=https%3A%2F%2Fdev.sw-faucet.pages.dev%2F';
            openLink(link);
        }

    }, [extensionName, installed, onDownload, onSelectWallet, openSelectWalletContext, type]);

    const iconDownload = useMemo(() => {
        if (isMobile){
            return '';
        }
        if (!installed) {
            return <Icon
                className={'__download-icon'}
                phosphorIcon={DownloadSimple}
                size='sm'
                weight='fill'
            />
        }

        return '';
    }, [installed, token.colorSecondary]);

    return (
        <SettingItem
            className={'wallet-item'}
            leftItemIcon={leftItemIcon}
            name={title}
            onPressItem={_onClick}
            key={extensionName}
            rightItem={iconDownload}
        />
    );
};

type Props = ThemeProps;

export const SELECT_WALLET_MODAL_ID = 'select-wallet-modal';

function Component({className}: Props): React.ReactElement<Props> {
    const {t} = useTranslation();

    const dotsamaWallets = useMemo(() => {
        if (isMobile) {
            return getWallets().filter((wallet) => wallet.extensionName === "subwallet-js").reverse();
        }
        return getWallets().filter((wallet) => wallet.extensionName !== "talisman").reverse();
    }, []);
    const openSelectWalletContext = useContext(OpenSelectWallet);


    const onRenderItem = useCallback((item: Wallet) => {
        // @ts-ignore
        let type = item.type ?? 'substrate';
        return (
            <ExtensionItem
                key={item.extensionName}
                {...item}
                installed={item.installed ?? true}
                type={type}
            />
        );
    }, []);

    const renderEmptyList = useCallback(() => {
        return (
            <EmptyList
                emptyMessage={t('Change your search criteria and try again')}
                emptyTitle={t('No extensions found')}
                phosphorIcon={MagnifyingGlass}
            />
        );
    }, [t]);

    return <ConnectModal
        id={SELECT_WALLET_MODAL_ID}
        className={CN(className)}
        title={t('Connect wallet')}
        onCancel={openSelectWalletContext.close}
        footer={false}
        wrapClassName={'sub-wallet-modal-wrapper'}
    >
        <SwList
            displayRow
            list={dotsamaWallets}
            renderItem={onRenderItem}
            renderWhenEmpty={renderEmptyList}
            rowGap='8px'
        />
    </ConnectModal>;
}

const SelectExtensionModal = styled(Component)<Props>(({theme: {token}}: Props) => {
    return {
        '.wallet-item': {
            paddingRight: 8,

            '.ant-web3-block': {
                paddingTop: 12,
                paddingBottom: 12
            }
        }
    };
});
export default SelectExtensionModal;
