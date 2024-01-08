import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router";
import {router} from "./router";
import {ThemeProvider} from "./providers/ThemeProvider";
import {AppStateProvider} from "./providers/AppStateProvider";
import NotificationProvider from './providers/NotificationProvider';
import {DataContextProvider} from "./providers/DataContext";
import {ModalContextProvider} from "@subwallet/react-ui";
import {ScreenContextProvider} from './providers/ScreenContext';
import {WalletContextProvider} from "./providers/WalletContextProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <DataContextProvider>
            <ScreenContextProvider>
                <ThemeProvider>
                    <ModalContextProvider>
                        <WalletContextProvider>
                            <NotificationProvider>
                                <AppStateProvider>
                                    <RouterProvider router={router}/>
                                </AppStateProvider>
                            </NotificationProvider>
                        </WalletContextProvider>
                    </ModalContextProvider>
                </ThemeProvider>
            </ScreenContextProvider>
        </DataContextProvider>
    </React.StrictMode>
);

