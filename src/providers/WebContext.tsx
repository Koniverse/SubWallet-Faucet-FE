// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

interface WebContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}



type WebContext = {
  title: string | React.ReactNode;
  setTitle: (title: string | React.ReactNode) => void;
  showBackButtonOnHeader?: boolean;
  setShowBackButtonOnHeader: (show?: boolean) => void;
  onBack?: VoidFunction;
  setOnBack: (func?: VoidFunction) => void;
}

export const WebContext = React.createContext({} as WebContext);

export const WebContextProvider = ({ children }: WebContextProviderProps) => {
  const [showBackButtonOnHeader, setShowBackButtonOnHeader] = useState<boolean | undefined>(undefined);
  const [title, setTitle] = useState<string | React.ReactNode>('');
  const [onBack, _setOnBack] = useState<VoidFunction | undefined>(undefined);

  const setOnBack = useCallback((func?: VoidFunction) => {
    _setOnBack(() => {
      return func;
    });
  }, []);
  return (
    <WebContext.Provider
      value={{
        title,
        setTitle,
        showBackButtonOnHeader,
        setShowBackButtonOnHeader,
        onBack,
        setOnBack,
      }}
    >
      {children}
    </WebContext.Provider>
  );
};
