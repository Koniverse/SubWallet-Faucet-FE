import {InputRef} from '@subwallet/react-ui';
import React, {ForwardedRef, forwardRef, useCallback, useMemo} from 'react';
import styled from 'styled-components';
import { ThemeProps} from '../../types';
import {useTranslation} from "react-i18next";
import {BaseSelectModal} from "../../components/Modal/BaseSelectModal";
import ParallelLogo from "../../components/Logo/ParallelLogo";

interface Props extends ThemeProps {
    loading?: boolean
}

const renderEmpty = () => <>a</>;

function Component(props: Props, ref: ForwardedRef<InputRef>): React.ReactElement<Props> {
    const {className = ''} = props;


    const onSelect = useCallback((address: string) => {

    }, []);
    const disabled = false;
    const id = 'address-input';
    const items: any[] = [
        {
            "slug": "parallel",
            "name": "Parallel",
            "isTestnet": false,
            "chainStatus": "ACTIVE",
            "icon": "https://chain-list-assets.subwallet.app/assets/chains/parallel.png",
        },
    ];
    const loading = false;
    const value: string = 'parallel';
    const {t} = useTranslation();

    const renderChainSelected = useCallback((item: any) => {
        if (loading) {
            return (
                <div className={'__loading-text'}>{t('Loading ...')}</div>
            );
        }

        return (
            <>
                <div className="__selected-icon">

                </div>
                <div className={'__selected-item'}>{item.name}</div>
            </>
        );
    }, [loading, t]);

    const chainLogo = useMemo(() => {
        return (
            <ParallelLogo/>
        );
    }, []);

    const renderItem = useCallback((item: any, selected: boolean) => {
        return (
            <>
                <div className="__render-item">
                    <div className="__render-item-icon">
                        <ParallelLogo/>
                    </div>
                    <div className="__render-item-name">
                        {item.name}
                    </div>
                </div>
            </>
        );
    }, []);

    return (
        <BaseSelectModal
            className={`${className} chain-selector-modal`}
            disabled={disabled}
            id={id}
            inputClassName={`${className} chain-selector-input`}
            itemKey={'slug'}
            items={items}
            loading={loading}
            onSelect={onSelect}
            placeholder={t('Select chain')}
            prefix={value !== '' && chainLogo}
            renderItem={renderItem}
            renderSelected={renderChainSelected}
            renderWhenEmpty={renderEmpty}
            selected={value || ''}
            title={ t('Select network')}
            tooltip={t('Select network')}
        />
    );
}

export const ChainSelector = styled(forwardRef(Component))<Props>(({theme: {token}}: Props) => {
    return ({
        '&.ant-select-modal-input-container .ant-select-modal-input-wrapper': {
            paddingLeft: 12,
            paddingRight: 12
        },

        '&.chain-selector-input': {
            '.__selected-item, .__loading-text': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },

            '.__selected-item': {
                color: token.colorText
            },

            '.__loading-text': {
                color: token.colorTextLight4
            }
        },

        '.chain-logo': {
            margin: '-1px 0'
        },

        '.ant-network-item .__check-icon': {
            display: 'flex',
            width: 40,
            justifyContent: 'center'
        },
        '.__render-item': {
            backgroundColor: token.colorBgSecondary,
            padding: '14px 12px',
            borderRadius: token.borderRadiusLG,
            display: 'flex',
            '.__render-item-icon': {
                paddingRight: 12,
            },
            '.__render-item-name': {
                fontSize: 16,
                lineHeight: 1.5,
                fontWeight: 600,
                color: '#fff',
            }
        }
    });
});
