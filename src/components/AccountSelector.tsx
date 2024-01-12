import {Icon, InputRef, Button} from '@subwallet/react-ui';
import {CaretDown, CheckCircle, CopySimple, Plugs} from 'phosphor-react';
import React, {ForwardedRef, forwardRef, useCallback, useContext, useMemo} from 'react';
import styled, {useTheme} from 'styled-components';
import {useTranslation} from "react-i18next";
import AccountItem from "@subwallet/react-ui/es/web3-block/account-item";
import CopyToClipboard from "react-copy-to-clipboard";
import {WalletAccount} from "@subwallet/wallet-connect/types";
import {Theme, ThemeProps} from "../types";
import {WalletContext} from "../providers/WalletContextProvider";
import {BaseSelectModal} from "./Modal/BaseSelectModal";
import {toShort} from "@subwallet/react-ui/es/_util/address";
import GeneralEmptyList from "./GeneralEmptyList";
import CN from "classnames";

interface Props extends ThemeProps {
    loading?: boolean
    disabled?: boolean
}
const renderEmpty = () => <GeneralEmptyList />;

function Component({className, disabled}: Props, ref: ForwardedRef<InputRef>): React.ReactElement<Props> {
    const {t} = useTranslation();
    const {disconnectAccount} = useContext(WalletContext);
    // const notification = useNotification();
    const {token} = useTheme() as Theme;
    const {accounts, walletAccount, setCurrentAddress} = useContext(WalletContext);
    const _onClickCopyButton = useCallback((e: React.SyntheticEvent) => {
        e.stopPropagation();
        // console.log(notification)
        // console.log('copy')
        // notification({message: t('Copied')});
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
                    avatarSize={24}
                    avatarTheme="polkadot"
                    className={'account-item'}
                    middleItem={(
                        <div className={`account-item-content-wrapper`}>
                            <div className={'account-item-address-wrapper'}>
                                <div className="__item-name">
                                    {item.name}
                                </div>
                                <div className="__item-address">
                                    ({toShort(item.address, 4, 5)})
                                </div>
                            </div>
                        </div>
                    )}

                    renderRightItem={() => {
                        return (
                            <>
                                {isSelected && (
                                    <div className={'__check-icon'}>
                                        <Icon
                                            iconColor={token.colorSuccess}
                                            phosphorIcon={CheckCircle}
                                            size='sm'
                                            type='phosphor'
                                            weight='fill'
                                        />
                                    </div>
                                )}
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
                    middleItem={(
                        <div className={`account-item-content-wrapper`}>
                            <div className={'account-item-address-wrapper'}>
                                <div className="__item-name">
                                    {item.name}
                                </div>
                                <div className="__item-address">
                                    ({toShort(item.address, 4, 5)})
                                </div>
                            </div>
                        </div>
                    )}
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
                            size={'sm'}
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
            className={CN([className, 'account-selector-modal'])}
            inputClassName={CN([className, 'account-selector-input'])}
            footer={renderFooter}
            fullSizeOnMobile
            id={"modalId"}
            disabled={disabled}
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
                    customSize={'20px'}
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
            paddingRight: 12,
        },
        '.ant-web3-block': {
            padding: '6px 4px 6px 12px',
        },
        '.ant-account-item:hover': {
            backgroundColor: 'transparent'
        },

        '.account-item': {
            '.ant-web3-block-right-item': {
                marginRight: 4
            },

            '.__check-icon': {
                minWidth: 40,
                display: 'flex',
                justifyContent: 'center'
            },

            '&:hover': {
                backgroundColor: token.colorBgInput
            }
        },

        '.account-item-address-wrapper': {
            display: 'flex',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '22px',
            overflow: 'hidden',
            'white-space': 'nowrap',
            paddingRight: token.paddingXS,
            gap: token.sizeXXS,

            '.__item-name': {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            },

            '.__item-address': {
                color: 'rgba(255, 255, 255, 0.45)',
            }
        },

        '@media (min-width: 768px)': {
            '.ant-sw-list-section .ant-sw-list-wrapper .empty-list': {
                position: 'relative',
            },
        }
    });
});
