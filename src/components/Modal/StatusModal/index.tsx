import {Button} from '@subwallet/react-ui';
import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {useTranslation} from "react-i18next";
import {ThemeProps} from "../../../types";
import {ResultType, StatusIconEnum} from "../../../types/dataType";
import {BaseModal} from "../BaseModal";
import StatusIcon, {StatusSize} from "../../Icon/StatusIcon";

const getLinkTransaction = (transaction: string) => {
    return `https://parallel.subscan.io/extrinsic/${transaction}`;
}

type Props = ThemeProps & {
    id: string,
    onCancel: () => void,
    result: ResultType | undefined,
}

function Component({
                       className = '',
                       result,
                       id,
                       onCancel
                   }: Props): React.ReactElement<Props> {
    const {t} = useTranslation();


    const getStatusError = useCallback((status: boolean) => {
        return status ? StatusIconEnum.SUCCESS : StatusIconEnum.FAIL;
    }, []);

    const contentList = useMemo(() => {
        const values = [];
        values.push({
            status: getStatusError(result?.accountSent || false),
            title: t('PARA in the faucet is still available.'),
        });
        values.push({
            status: getStatusError(result?.hasNotReceivedFaucet || false),
            title: t('The address hasn’t received PARA from the faucet.'),
        });
        values.push({
            status: getStatusError(result?.accountReceivedNative || false),
            title: t('The address has 0 PARA.'),
        });
        values.push({
            status: getStatusError(result?.accountReceived || false),
            title: t('The address has either DOT or cDOT-7/14 on the Parallel network.'),
        });
        return values;
    }, [t, result, getStatusError]);
    const description = useMemo(() => {
        let description = t('You are not eligible to receive PARA from the faucet. \n' +
            'Try again with a different wallet address.');
        if (!result?.transaction && result?.error) {
            description = t('The faucet is overloaded at the moment. \n' +
                'Try again later.')
        }
        if (result?.transaction) {
            description = t('You have received 1 PARA to your wallet address.\n');
            description += `<a href="${getLinkTransaction(result?.txHash)}" target="_blank">${t('View the transaction')}</a>`;
            description += t(' or check PARA in your wallet.')
        }
        return description;
    }, [t, result]);


    return (
        <BaseModal
            className={className}
            id={id}
            onCancel={onCancel}
            title={result?.transaction ? t('Success!') : t('Error!')}
        >
            <div className={'__container'}>


                <div className="__center">
                    <div>
                        <StatusIcon status={result?.transaction ? StatusIconEnum.SUCCESS : StatusIconEnum.FAIL}
                                    size={StatusSize.LARGE} className={'flex'}/>
                    </div>
                    <div className="__description" dangerouslySetInnerHTML={{__html: description}}>
                    </div>
                    {!result?.transaction && !result?.error &&
                        <div className="__content">
                            <div className="__content-area-title">
                                {t('Eligibility check?')}
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
                        </div>}
                </div>
            </div>
            <Button
                block={true}
                onClick={onCancel}
                className={'__button'}
            >
                {result?.error ? t('I understand') : t('Back to home')}
            </Button>
        </BaseModal>
    );
}

export const StatusModal = styled(Component)<Props>(({theme: {token}}: Props) => {
    return ({
        '.__container': {
            padding: '12px 12px 4px',
            '.__center': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: token.marginSM,
            }
        },

        '.__row': {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: token.marginSM
        },
        '.__button-status': {
            display: 'flex',
        },

        '.__label': {
            paddingRight: token.paddingSM
        },
        '.__value': {
            width: 162,
            textAlign: 'right'
        },
        '.__button': {
            position: 'sticky',
            bottom: 5,
        },
        '.__button svg': {
            marginRight: token.marginSM
        },
        '.__description': {
            marginTop: 24,
            marginBottom: 32,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '22px',
            color: 'rgba(255, 255, 255, 0.4)',
            textAlign: 'center',
        },
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


        '@media (max-height: 755px)': {
            '.__container': {
                height: '90%',
                overflow: 'auto',
            }
        },
    });
});
