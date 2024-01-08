import {Icon, InputRef, Button} from '@subwallet/react-ui';
import {CaretDown, CheckCircle, CopySimple, Plugs} from 'phosphor-react';
import React, {ForwardedRef, forwardRef, useCallback, useContext, useMemo} from 'react';
import styled, {useTheme} from 'styled-components';
import {Theme, ThemeProps} from '../../types';
import {useTranslation} from "react-i18next";
import {BaseSelectModal} from "../../components/Modal/BaseSelectModal";
import AccountItem from "@subwallet/react-ui/es/web3-block/account-item";
import CopyToClipboard from "react-copy-to-clipboard";
import {WalletAccount} from "@subwallet/wallet-connect/types";
import {WalletContext} from "../../providers/WalletContextProvider";

interface Props extends ThemeProps {
    loading?: boolean
}

function Component(props: Props, ref: ForwardedRef<InputRef>): React.ReactElement<Props> {
    const {t} = useTranslation();
    const {disconnectAccount} = useContext(WalletContext);
    const { token } = useTheme() as Theme;
    const {accounts, walletAccount, setCurrentAddress} = useContext(WalletContext);
    const _onClickCopyButton = useCallback((e: React.SyntheticEvent) => {
        e.stopPropagation();
    }, []);
    const _onSelect = useCallback(async (address: string) => {
        setCurrentAddress(address);
    }, [setCurrentAddress]);
    const renderItem = useCallback((item: any): React.ReactNode => {
        const isSelected = walletAccount?.address === item.address;
        return (
            <div className='__render-item'>
                <AccountItem
                    address={item.address}
                    addressPreLength={9}
                    addressSufLength={9}
                    avatarIdentPrefix={42}
                    avatarSize={40}
                    avatarTheme="polkadot"

                    renderRightItem={() => {
                        return (
                            <>
                                {isSelected && <Icon
                                    iconColor={token.colorSuccess}
                                    phosphorIcon={CheckCircle}
                                    size='sm'
                                    type='phosphor'
                                    weight='fill'
                                />
                                }
                                <CopyToClipboard text={item.address}>
                                    <Button
                                        className='-show-on-hover'
                                        icon={
                                            <Icon
                                                phosphorIcon={CopySimple}
                                                size='sm'
                                            />
                                        }
                                        onClick={_onClickCopyButton}
                                        size='xs'
                                        tooltip={t('Copy address')}
                                        type='ghost'
                                    />
                                </CopyToClipboard>
                            </>
                        )
                    }}
                />
            </div>
        );
    }, [_onClickCopyButton, t, token.colorSuccess, walletAccount?.address]);
    const searchAccountFunction = (item: any, searchText: string): boolean => {
        return item.address.toLowerCase().includes(searchText.toLowerCase()) || (item.name || '').toLowerCase().includes(searchText.toLowerCase());
    };
    const renderEmpty = useCallback((item: any): React.ReactNode => {
        return (
            <div className='__render-empty'>
            </div>
        );
    }, []);
    const renderSelectedItem = useCallback((item: WalletAccount): React.ReactNode => {
        return (
            <div className='selected-account'>
                <AccountItem
                    address={item.address}
                    addressPreLength={9}
                    addressSufLength={9}
                    avatarIdentPrefix={42}
                    avatarSize={24}
                    avatarTheme="polkadot"
                />
                <CopyToClipboard text={item.address || ''}>
                    <Button
                        className='-show-on-hover'
                        icon={
                            <Icon
                                phosphorIcon={CopySimple}
                                size='sm'
                            />
                        }
                        onClick={_onClickCopyButton}
                        size='xs'
                        tooltip={t('Copy address')}
                        type='ghost'
                    />
                </CopyToClipboard>
            </div>
        );
    }, [_onClickCopyButton, t]);
    const _onDisconnect = useCallback(() => {
        disconnectAccount();
    }, [disconnectAccount])
    const renderFooter = useMemo(() => {
        return (
            <Button className='__button-disconnect' onClick={_onDisconnect}
                    danger={true}
                    style={{width: '100%'}}
                    icon={(
                        <Icon
                            phosphorIcon={Plugs}
                            size={'xs'}
                            weight={'fill'}

                        />
                    )}
            >
                {t('Disconnect')}
            </Button>
        )
    }, [_onDisconnect, t]);

    return (
        <BaseSelectModal
            background={'default'}
            className={'className'}
            footer={renderFooter}
            fullSizeOnMobile
            id={"modalId"}
            ignoreScrollbarMethod='padding'
            inputWidth={'100%'}
            itemKey='address'
            items={accounts ?? []}
            onSelect={_onSelect}
            renderItem={renderItem}
            renderSelected={renderSelectedItem}
            renderWhenEmpty={renderEmpty}
            searchFunction={searchAccountFunction}
            searchMinCharactersCount={2}
            searchPlaceholder={t<string>('Account name')}
            shape='default'
            size='small'
            suffix={
                <Icon
                    phosphorIcon={CaretDown}
                    weight={'bold'}
                />
            }
            title={t('Select account')}
            selected={walletAccount?.address ?? ''}/>
    );
}

export const AccountSelector = styled(forwardRef(Component))<Props>(({theme: {token}}: Props) => {
    return ({
        '&.ant-select-modal-input-container .ant-select-modal-input-wrapper': {
            paddingLeft: 12,
            paddingRight: 12
        },
    });
});
