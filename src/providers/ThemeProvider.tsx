// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0


import {ConfigProvider, theme as reactUiTheme} from '@subwallet/react-ui';
import React, {useMemo} from 'react';
import styled, {createGlobalStyle, ThemeProvider as StyledComponentThemeProvider} from 'styled-components';
import {Theme, ThemeProps} from "../types";
import {generateTheme, SW_THEME_CONFIGS, SwThemeConfig} from "../themes";

const {useToken} = reactUiTheme;

interface Props {
    children: React.ReactNode;
    themeConfig: SwThemeConfig
}

const GlobalStyle = createGlobalStyle<ThemeProps>(({theme}) => {
    const {token} = theme as Theme;

    return ({
        body: {
            fontFamily: token.fontFamily,
            color: '#000000',
            fontWeight: token.bodyFontWeight,
            backgroundColor: token["gray-1"]
        },
        pre: {
            fontFamily: 'inherit',
            whiteSpace: 'pre-wrap'
        },

        '.main-page-container': {
            border: `${token.lineWidth}px ${token.lineType} ${token.colorBgInput}`,
            borderBottomWidth: token.lineWidth * 2
        },

        '.text-secondary': {
            color: token.colorTextSecondary
        },

        '.text-tertiary': {
            color: token.colorTextTertiary
        },

        '.text-light-2': {
            color: token.colorTextLight2
        },

        '.text-light-4': {
            color: token.colorTextLight4
        },

        '.common-text': {
            fontSize: token.fontSize,
            lineHeight: token.lineHeight
        },

        '.sm-text': {
            fontSize: token.fontSizeSM,
            lineHeight: token.lineHeightSM
        },

        '.mono-text': {
            fontFamily: token.monoSpaceFontFamily
        },

        '.ml-xs': {
            marginLeft: token.marginXS
        },

        '.ml-xxs': {
            marginLeft: token.marginXXS
        },

        '.text-danger': {
            color: token.colorError
        },

        '.h3-text': {
            fontSize: token.fontSizeHeading3,
            lineHeight: token.lineHeightHeading3,
            fontWeight: token.headingFontWeight
        },

        '.h4-text': {
            fontSize: token.fontSizeHeading4,
            lineHeight: token.lineHeightHeading4,
            fontWeight: token.headingFontWeight
        },

        '.h5-text': {
            fontWeight: token.headingFontWeight,
            fontSize: token.fontSizeHeading5,
            lineHeight: token.lineHeightHeading5
        },

        '.form-row': {
            display: 'flex',
            gap: token.sizeSM,

            '.ant-form-item': {
                flex: 1,
                overflow: 'hidden'
            }
        },

        '.item-disabled': {
            opacity: 0.4,
            cursor: 'not-allowed !important',
            backgroundColor: `${token.colorBgSecondary} !important`
        },

        '.common-page': {
            padding: token.paddingSM,
            paddingBottom: token.paddingLG,
        },

        '.project-description': {
            borderRadius: token.borderRadius,
            padding: token.paddingXS,
            backgroundColor: token['gray-1'],
            textAlign: 'left',
        },

        '.mb-xs': {
            marginBottom: token.marginXS
        },
        '.mb-sm': {
            marginBottom: token.marginSM
        },
        '.mb-md': {
            marginBottom: token.marginMD
        },
        '.mb-lg': {
            marginBottom: token.marginLG
        }
    });
});

function ThemeGenerator({children, themeConfig}: Props): React.ReactElement<Props> {
    const {token} = useToken();

    // Generate theme from config
    const theme = useMemo<Theme>(() => {
        return generateTheme(themeConfig, token);
    }, [themeConfig, token]);
    return (
        <StyledComponentThemeProvider theme={theme}>
            <GlobalStyle theme={theme}/>
            {children}
        </StyledComponentThemeProvider>
    );
}

export interface ThemeProviderProps {
    children: React.ReactNode;
}

const getModalContainer = () => document.getElementById('popup-container') || document.body;
const getPopupContainer = () => document.getElementById('tooltip-container') || document.body;

const TooltipContainer = styled.div`z-index: 10000`;

export function ThemeProvider({children}: ThemeProviderProps): React.ReactElement<ThemeProviderProps> {
    const themeName = 'dark';

    const themeConfig = useMemo(() => {
        const config = SW_THEME_CONFIGS[themeName];

        // Object.assign(config.logoMap.network, logoMaps.chainLogoMap);
        // Object.assign(config.logoMap.symbol, logoMaps.assetLogoMap);

        return config;
    }, [themeName]);
    return (
        <ConfigProvider
            getModalContainer={getModalContainer}
            getPopupContainer={getPopupContainer}
            theme={themeConfig}
        >
            <ThemeGenerator themeConfig={themeConfig}>
                <TooltipContainer id='tooltip-container'/>
                {children}

            </ThemeGenerator>
        </ConfigProvider>
    );
}
