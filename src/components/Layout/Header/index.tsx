// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {Button, Icon} from '@subwallet/react-ui';
import {CaretLeft, Question} from 'phosphor-react';
import React, {useCallback, useContext} from 'react';
import styled from 'styled-components';
import {ThemeProps} from "../../../types";
import {useTranslation} from "react-i18next";
import Logo2D from "../../Logo/Logo2D";
import {useNavigate} from "react-router-dom";
import {ScreenContext, Screens} from "../../../providers/ScreenContext";
import CN from "classnames";

export type Props = ThemeProps & {
    title?: string | React.ReactNode;
    onBack?: () => void;
    showBackButton?: boolean
}

function Component({
                       className,
                       onBack,
                       showBackButton = false,
                       title
                   }: Props): React.ReactElement<Props> {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {screenType} = useContext(ScreenContext);
    const goHome = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const defaultOnBack = useCallback(() => {
        goHome();
    }, [goHome]);
    return (
        <div className={className}>
            <div className='__box'>
                <div className={CN('__left-part', screenType === Screens.MOBILE ? '__ui-mobile' : '')}>
                    <div
                        className='__logo'
                        onClick={goHome}
                        style={{cursor: 'pointer'}}
                    >
                        <Logo2D
                            height={24}
                            width={24}
                        />
                    </div>
                    {!!title && showBackButton && (
                        <Button
                            className='__back-button'
                            icon={
                                <Icon
                                    customSize='28px'
                                    phosphorIcon={CaretLeft}
                                />
                            }
                            onClick={onBack || defaultOnBack}
                            size='xs'
                            type='ghost'
                        />
                    )}
                </div>
                {!!title && (
                    <div className='__title-wrapper'>
                        <div className={'__title'}>{title}</div>
                    </div>
                )}
                <Button
                    className={'__help-button'}
                    icon={
                        <Icon
                            customSize='28px'
                            phosphorIcon={Question}
                            weight={'duotone'}
                        />
                    }
                    size='xs'
                    type='ghost'
                >
                    {t<string>('Help')}
                </Button>
            </div>
        </div>
    );
}

const Simple = styled(Component)<Props>(({theme: {token}}: Props) => ({
    padding: '24px 24px 48px',
    '.__logo': {
        color: '#ffffff'
    },

    '.__box': {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    '.__left-part': {
        position: 'relative',
        zIndex: 5,
        maxWidth: '6%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&.__ui-mobile': {
            justifyContent: 'start'
        }
    },

    '.__back-button.__back-button': {
        color: token.colorTextLight1
    },

    '.__title-wrapper': {
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        zIndex: 2
    },

    '.__title': {
        fontSize: token.fontSizeHeading2,
        lineHeight: token.lineHeightHeading2,
        color: token.colorTextLight1,
        fontWeight: token.headingFontWeight
    },

    '.__help-button': {
        position: 'relative',
        zIndex: 5,
        right: -16
    }
}));

export default Simple;
