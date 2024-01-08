import CN from 'classnames';
import React, {useContext} from 'react';
import styled from 'styled-components';
import {ThemeProps} from "../../types";
import Header from "./Header";
import {AppContext} from "../../providers/AppStateProvider";
import {DataContext} from "../../providers/DataContext";
import {ScreenContext, Screens} from "../../providers/ScreenContext";
import SelectWalletModal from "../Modal/Wallet/SelectWalletModal";


export interface LayoutBaseWebProps {
    children: React.ReactNode | React.ReactNode[];
    className?: string;
}

const StyledLayout = styled('div')<ThemeProps>(({theme: {extendToken, token}}: ThemeProps) => {
    return {
        display: 'flex',
        flex: 'auto',
        position: 'relative',
        backgroundColor: extendToken.bodyBackgroundColor,

        '.web-layout-header, .web-layout-header-simple': {
            position: 'relative',
            zIndex: 10
        },

        '.web-layout-background': {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            transitionDuration: 'background-color 0.3s ease',
            background: extendToken.tokensScreenInfoBackgroundColor,

            '&.__background-common': {
                background: token.colorBgDefault
            },
            '&.__background-info': {
                background: extendToken.tokensScreenInfoBackgroundColor
            },
            '&.__background-increase': {
                background: extendToken.tokensScreenSuccessBackgroundColor
            },
            '&.__background-decrease': {
                background: extendToken.tokensScreenDangerBackgroundColor
            }
        },

        '&.web-layout-container': {
            // display: 'flex',
            minHeight: '100%',
            // flexDirection: 'column'
        },

        '.web-layout-body': {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            flex: 1
        },

        '&.header-type-common .web-layout-body': {
            height: '100%',
            width: '100%'
        },

        '.web-layout-header': {
            flex: 0,
            padding: '24px',
        },

        '.web-layout-content': {
            flex: 1,
            margin: '0 auto',
            width: '90%',
            height: '100%',
            overflow: 'auto',
        },

        '.web-cancel-fill-height .ant-sw-screen-layout-body': {
            flex: 'initial'
        },

        '.ant-sw-screen-layout-container': {
            backgroundColor: 'transparent'
        },

        '.left-acton': {
            display: 'flex',
            width: '110px',
            justifyContent: "space-between",
        },

        '.ant-sw-screen-layout-body': {
            display: 'flex',
            flexDirection: 'column'
        },
    };
});

const BaseWeb = ({children}: LayoutBaseWebProps) => {
    const {title, onBack, showBackButtonOnHeader} = useContext(AppContext);
    const {isReady} = useContext(DataContext);
    const {screenType} = useContext(ScreenContext);

    return (
        <StyledLayout className={CN('web-layout-container')}>
            {isReady && title && <div className={CN('web-layout-background' )}/>}

            <div className={CN('web-layout-body')}>
                {isReady && title && <Header title={title} onBack={onBack} showBackButton={showBackButtonOnHeader}/>}
                <div className={CN('web-layout-content', screenType === Screens.MOBILE ? 'screen-mobile' : '')}>
                    {children}
                </div>
            </div>
            <SelectWalletModal />
        </StyledLayout>
    );
};

export default BaseWeb;
