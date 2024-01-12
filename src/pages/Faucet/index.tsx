import {Button, Divider, Icon, ModalContext} from "@subwallet/react-ui";
import {useTranslation} from "react-i18next";
import {ThemeProps} from "../../types";
import styled from "styled-components";
import PageWrapper from "../../components/Layout/PageWrapper";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AppContext} from "../../providers/AppStateProvider";
import {OpenSelectWallet, WalletContext} from "../../providers/WalletContextProvider";
import {Vault} from 'phosphor-react';
import StatusIcon from "../../components/Icon/StatusIcon";
import {ResultType, StatusIconEnum} from "../../types/dataType";
import {StatusModal} from "../../components/Modal/StatusModal";
import FaucetService from "../../libs/Service/FaucetService";
import NoteBox from "../../components/Footer/NoteBox";
import {ChainSelector} from '../../components/ChainSelector';
import {AccountSelector} from '../../components/AccountSelector';
import {openInNewTab} from "../../libs";
import {sendEventGA} from "../../utils";

const RESULT_MODAL = 'result-modal-id';
const Component = () => {
    const {t} = useTranslation();
    const {activeModal, inactiveModal} = useContext(ModalContext);
    const {setTitle, setShowBackButtonOnHeader} = useContext(AppContext);
    const [submitLoading, setSubmitLoading] = useState(false);
    const {open} = useContext(OpenSelectWallet);
    const {accounts, walletAccount, currentSignature, setCurrentSignature, signMessage} = useContext(WalletContext);
    const [result, setResult] = useState<ResultType>({} as ResultType);


    useEffect(() => {
        setTitle(t('Faucet'));
        setShowBackButtonOnHeader(false);
    }, [setShowBackButtonOnHeader, setTitle, t]);

    const contentList = useMemo(() => {
        const values = [];
        values.push({
            status: StatusIconEnum.DEFAULT,
            title: t('PARA in the faucet is still available.'),
        });
        values.push({
            status: StatusIconEnum.DEFAULT,
            title: t('The address hasn’t received PARA from the faucet.'),
        });
        values.push({
            status: StatusIconEnum.DEFAULT,
            title: t('The address has 0 PARA.'),
        });
        values.push({
            status: StatusIconEnum.DEFAULT,
            title: t('The address has either DOT or cDOT-7/14 on the Parallel network.'),
        });
        return values;
    }, [t]);

    const onCloseResultModal = useCallback(() => {
        inactiveModal(RESULT_MODAL);
    }, [inactiveModal]);

    const onClickReceive = useCallback(async () => {
        if (walletAccount === undefined) {
            return;
        }
        setSubmitLoading(true);
        sendEventGA('faucetClick');
        const isSign = currentSignature === undefined || currentSignature === '';
        let newSignature: string | null = currentSignature || '';
        if (isSign) {
            try {
                const dataRandom = await FaucetService.getRandomCode(walletAccount.address);
                // @ts-ignore
                const {randomCode} = dataRandom;
                newSignature = await signMessage(walletAccount.address, randomCode);
                if (newSignature != null) {
                    setCurrentSignature(newSignature);
                }
            } catch (e) {
                setSubmitLoading(false);
            }
        }
        let extension = walletAccount.source === 'polkadot' ? 'polkadot-js' : 'subwallet';
        if (newSignature) {
            try {
                const response = await FaucetService.submit(walletAccount.address, newSignature, extension) as unknown as ResultType;
                setResult({...response, error: false});
                if (response.transaction){
                    sendEventGA('faucetReceive');
                }
                activeModal(RESULT_MODAL);
            } catch (e) {
                setResult({
                        accountSent: false,
                        hasNotReceivedFaucet: false,
                        accountReceived: false,
                        transaction: false,
                        txHash: '',
                        error: true,
                    } as ResultType
                )
            }
            activeModal(RESULT_MODAL);
        }
        setSubmitLoading(false);

    }, [activeModal, currentSignature, setCurrentSignature, signMessage, walletAccount]);

    return (
        <>
            <div className="body-area">
                <ChainSelector className={'__chain_selector'}/>
                {accounts.length > 0 && <AccountSelector disabled={submitLoading} className={'__account_selector'}/>}

                <div className="__content-area">
                    <div className="__content-area-title">
                        {t('Eligibility criteria')}
                    </div>
                    {contentList.map((item, index) => {
                        return (
                            <div className="__content-area-subtitle" key={index}>
                                <StatusIcon status={item.status}/>
                                <div className="__content-area-subtitle-text">
                                    {item.title}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Divider/>
                <div className="__description-area">
                    {t('This faucet transfers 1 PARA per 1 wallet address to cover gas fees on the Parallel network. Connect your wallet and check eligibility to receive PARA.')}
                </div>
                {accounts.length > 0 &&
                    <Button className='__button-item' onClick={onClickReceive} loading={submitLoading}>
                        {t('Receive')}
                    </Button>
                }
                {accounts.length === 0 &&
                    <Button className='__button-item' onClick={open}>
                        {t('Connect wallet')}
                    </Button>
                }
            </div>

            {result && <StatusModal
                result={result}
                id={RESULT_MODAL}
                onCancel={onCloseResultModal}
            />}


            <div className={'__footer-area'}>
                <NoteBox
                    className={'__note-box'}
                    content={t('There\'re multiple ways you can play with your unlocked DOT, such as native staking, liquid staking, or lending. Check out SubWallet Dashboard for curated options with competitive APY to earn yield on your DOT.')}
                    title={t('Crowdloan unlock, then what?')}
                />

                <Button
                    className={'__footer-button'}
                    contentAlign={'left'}
                    icon={
                        <Icon
                            className='__footer-button-icon'
                            phosphorIcon={Vault}
                            size='md'
                            weight='fill'
                        />
                    }
                >
                    <div className={'__footer-button-content'} onClick={() => {
                        sendEventGA('redirectToEarn')
                        openInNewTab('https://earn.subwallet.app/')();
                    }}>
                        <div className={'__footer-button-title'}>{t('Rewards: 18% - 24%')}</div>
                        <div className={'__footer-button-subtitle'}>{t('Earn with SubWallet Dashboard')}</div>
                    </div>
                </Button>
            </div>
        </>
    )
}
type Props = ThemeProps;
type WrapperProps = ThemeProps & {
    searchInput?: string
}

function WrapperComponent({className = ''}: ThemeProps): React.ReactElement<Props> {

    return (
        <PageWrapper
            className={`tokens ${className}`}
        >
            <Component/>
        </PageWrapper>
    );
}

const FaucetIndex = styled(WrapperComponent)<WrapperProps>(({theme: {extendToken, token}}: WrapperProps) => {
    return ({
        paddingTop: 24,
        paddingLeft: token.padding,
        paddingRight: token.padding,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        inset: 0,
        maxWidth: 1184,
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 'auto',
        minHeight: '100%',

        '.body-area': {
            flex: '1 1 0%',
            maxWidth: 384,
            paddingBottom: 80,
            borderRadius: 8,
            gap: 24,
            '.__content-area': {
                marginTop: 24,
                '.__content-area-title': {
                    marginBottom: 19,
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: '24px',
                    color: 'rgba(255, 255, 255, 1)',
                },
                '.__content-area-subtitle': {
                    display: 'flex',
                    marginBottom: 19,
                    '.__content-area-subtitle-text': {
                        marginLeft: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: '22px',
                        color: 'rgba(255, 255, 255, 0.65)',
                    }
                },
            },

            '.__description-area': {
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '22px',
                color: 'rgba(255, 255, 255, 0.4)',
            },
            '.__button-item': {
                width: '100%',
                marginTop: 24,
            },
            '.__chain_selector': {
                marginBottom: 16,
            },
            '.__account_selector': {

            },
            '.selected-account': {
                display: 'flex',
                justifyContent: 'space-between',
                '.ant-web3-block': {
                    padding: 0,
                    width: '100%',
                }
            }

        },
        '.ant-select-modal-input-wrapper': {
            height: 52,

            '.account-item-content-wrapper': {

                '.account-item-address-wrapper': {
                    display: 'flex',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '22px',
                    color: 'rgba(255, 255, 255)',

                    '.__item-address': {
                        color: 'rgba(255, 255, 255, 0.45)',
                    }
                }
            }
        },
        '.__empty-list': {
            marginTop: token.marginSM,
            marginBottom: token.marginSM
        },


        '.__footer-area': {
            borderTop: `2px solid ${token.colorBgDivider}`,
            display: 'flex',
            gap: token.size,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: token.sizeLG,
            paddingBottom: 42,
            background: token.colorBgDefault,
            opacity: 1,
            zIndex: 10
        },

        '.__note-box': {
            maxWidth: 684,
            flex: '1 0 300px'
        },

        '.__footer-button': {
            height: 72,
            flex: 1,
            paddingRight: token.paddingSM,
            paddingLeft: token.paddingSM,
            gap: token.size,
            maxWidth: 384
        },

        '.__footer-button-icon': {
            width: 40,
            height: 40,
            justifyContent: 'center'
        },

        '.__footer-button-content': {
            textAlign: 'left'
        },

        '.__footer-button-title': {
            fontSize: token.fontSizeLG,
            lineHeight: token.lineHeightLG,
            color: token.colorTextLight1,
            marginBottom: token.marginXXS
        },

        '.__footer-button-subtitle': {
            fontSize: token.fontSize,
            lineHeight: token.lineHeight,
            color: token.colorTextLight3
        },

        '@media (max-width: 991px)': {
            '.__footer-area': {
                position: 'static',
                paddingTop: token.padding
            },

            '.__table-area': {
                paddingTop: 0,
                paddingBottom: token.sizeXS
            },

            '.__tool-area': {
                position: 'sticky',
                display: 'block',
                top: 0,
                background: token.colorBgDefault,
                zIndex: 10
            },

            '.__form-area': {
                marginTop: token.marginXS,
                marginBottom: token.margin
            },

            '.__tag-area': {
                minWidth: '100%',
                paddingBottom: token.padding,
                marginBottom: 0,
                justifyContent: 'flex-start'
            }
        },

        '@media (max-width: 767px)': {
            '.__footer-button': {
                minWidth: '100%'
            },

            '.__buttons-block': {
                '.ant-btn': {
                    minWidth: '100%'
                }
            },

            '.body-area': {
                paddingBottom: 104
            }
        },

        '@media (max-width: 500px)': {
            '.body-area': {
                maxWidth: 'none'
            }
        }
    });
});

export default FaucetIndex;
