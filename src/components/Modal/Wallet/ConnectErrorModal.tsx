// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, {useCallback, useContext} from 'react';
import {OpenSelectWallet} from "../../../providers/WalletContextProvider";
import {Button, Icon, ModalContext} from "@subwallet/react-ui";
import {useTranslation} from "react-i18next";
import { ThemeProps} from "../../../types";
import styled from "styled-components";
import {Warning} from "phosphor-react";
import {Wallet} from '@subwallet/wallet-connect/types';
import CN from "classnames";
import {ConnectModal} from "../ConnectModal";
type Props = ThemeProps;

export const SELECT_WALLET_MODAL_ERROR_ID = 'select-wallet-modal-error';

function Component({className}: Props): React.ReactElement<Props> {
    const {t} = useTranslation();
    const {activeModal, inactiveModal} = useContext(ModalContext);
    const openSelectWalletContext = useContext(OpenSelectWallet);

    let onCancel = useCallback(() => {
        inactiveModal(SELECT_WALLET_MODAL_ERROR_ID);
    }, [openSelectWalletContext]);
    return <ConnectModal
        id={SELECT_WALLET_MODAL_ERROR_ID}
        className={CN(className)}
        title={t('Error')}
        onCancel={onCancel}
        footer={false}
        wrapClassName={'sub-wallet-modal-wrapper'}
    >
        <div className="wallet-content">
             <Icon
                        className={CN('__item-icon')}
                        phosphorIcon={Warning}
                        iconColor={'#bf1616'}
                        size={'lg'}
                        weight={'fill'}
                    />
            <div className={'__item __title'}>{t('Unable to connect.')}</div>
            <div className={'__item'}>{t('User rejects wallet connection.')}</div>
            <Button
                block={true}
                onClick={onCancel}
                className={'__button'}
            >
                {t('Back to home')}
            </Button>
        </div>

    </ConnectModal>;
}

const SelectExtensionModal = styled(Component)<Props>(({theme: {token}}: Props) => {
    return {
        '.__button': {
            backgroundColor: '#1A1A1A',
        },
        '.wallet-content': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
        },
        '.__item': {
            display: 'flex',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '22px',
            color: 'rgba(255, 255, 255)',
            '&.__title': {
               color: '#bf1616',
               fontSize: 16,
            }
        },
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
