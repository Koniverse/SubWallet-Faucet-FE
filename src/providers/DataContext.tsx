import React, {useState} from 'react';

interface DataContextProviderProps {
    children?: React.ReactElement;
}

type _DataContext = {
    getData: Promise<boolean>;
    isReady?: boolean;
}

export const DataContext = React.createContext({} as _DataContext);

export const DataContextProvider = ({children}: DataContextProviderProps) => {
    const [isReady, setIsReady] = useState(false);
    const getData: Promise<boolean> = new Promise(async (resolve, reject) => {
        setTimeout(() => {
            resolve(true);
            setIsReady(true);
        }, 500);
    });

    return <DataContext.Provider value={{getData, isReady}}>
        {children}
    </DataContext.Provider>
};
