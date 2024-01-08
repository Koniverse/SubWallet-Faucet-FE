// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {getWalletBySource, getWallets} from '@subwallet/wallet-connect/dotsama/wallets';
import {getEvmWalletBySource} from '@subwallet/wallet-connect/evm/evmWallets';
import React, {useCallback, useContext, useMemo} from 'react';
import {OpenSelectWallet, WalletContext} from "../../../providers/WalletContextProvider";
import {Icon, Image, Modal, SettingItem, SwList} from "@subwallet/react-ui";
import {useTranslation} from "react-i18next";
import {Theme, ThemeProps} from "../../../types";
import styled, {useTheme} from "styled-components";
import {DownloadSimple, CheckCircle, MagnifyingGlass} from "phosphor-react";
import EmptyList from "../../EmptyList";
import {Wallet} from '@subwallet/wallet-connect/types';
import CN from "classnames";
import {openInNewTab} from "../../../libs";

type ExtensionItemProps = Wallet & {
    type: 'substrate' | 'evm',
    installed: boolean

}
const ExtensionItem: React.FC<ExtensionItemProps> = (props: ExtensionItemProps) => {

    const openSelectWalletContext = useContext(OpenSelectWallet);
    const walletContext = useContext(WalletContext);
    const {logo, extensionName, title, installed, installUrl, type} = props;

    const {token} = useTheme() as Theme;

    const leftItemIcon = useMemo(() => {
        return (
            <Image
                height={28}
                src={logo.src}
                alt={logo.alt}
                width={28}
            />
        );
    }, [logo]);
    const onSelectWallet = useCallback(
        (walletKey: string, walletType: 'substrate' | 'evm' = 'substrate') => {
            if (walletType === 'substrate') {
                console.log('walletKey', walletKey)
                console.log(getWalletBySource(walletKey))
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
        if (installed) {
            onSelectWallet(extensionName, type);
            openSelectWalletContext.close()
        } else {
            onDownload();
        }

    }, [extensionName, installed, onDownload, onSelectWallet, openSelectWalletContext, type]);

    return (
        <SettingItem
            className={'wallet-item'}
            leftItemIcon={leftItemIcon}
            name={title}
            onPressItem={_onClick}
            key={extensionName}
            rightItem={(
                !installed
                    ? <Icon
                        className={'__download-icon'}
                        phosphorIcon={DownloadSimple}
                        size='sm'
                        weight='fill'
                    />
                    : (
                        <Icon
                            className={'__selected-icon'}
                            iconColor={token.colorSecondary}
                            phosphorIcon={CheckCircle}
                            size='sm'
                            weight='fill'
                        />
                    )
            )}
        />
    );
};

type Props = ThemeProps;

export const SELECT_WALLET_MODAL_ID = 'select-wallet-modal';

function Component({className}: Props): React.ReactElement<Props> {
    const {t} = useTranslation();
    const dotsamaWallets = getWallets().filter((wallet) => wallet.extensionName !== "talisman");
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

    return <Modal
        className={CN(className)}
        title={t('Connect wallet')}
        open={openSelectWalletContext.isOpen}
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
    </Modal>;
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
