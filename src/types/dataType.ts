import {TagProps} from "@subwallet/react-ui";
import {IconProps} from "phosphor-react";
import React from "react";
import {PhosphorIcon} from "./index";

export interface Provider {
    id: string
    name: string
    url: string
}

export enum BuyTokenSupport {
    ETHEREUM = 'ETHEREUM',
    SUBSTRATE = 'SUBSTRATE',
}

export enum CrowdloanStatus {
    WON = 'won',
    IN_AUCTION = 'in_auction',
    FAILED = 'failed',
    WITHDRAW = 'withdraw',
}

export interface CrowdloanType {
    id: number,
    paraId: number,
    fundId: string,
    status: CrowdloanStatus,
    metadata: object,
    relayChain: string,
    auctionIndex: number,
    firstPeriod: number,
    lastPeriod: number,
    startTime: Date,
    endTime: Date,
    chain: {
        data: {
            id: number,
            attributes: Chain
        }
    }
}

export interface BuyServiceInfo {
    id: number,
    name: string,
    slug: string,
    contractUrl: string,
    isSuspended: boolean,
    symbol: string,
    network: string,
    service: string,
}

export interface BuyTokenConfig {
    id: number,
    chain_asset: {
        data: {
            attributes: ChainAsset,
            id: number
        }
    },
    support: BuyTokenSupport,
    services: BuyServiceInfo[],
}

export interface ChainAsset {
    id: string,
    name: string,
    slug: string,
    symbol: string
    originChain: {
        data: {
            attributes: Chain,
            id: number
        }
    },
    icon: {
        data: {
            attributes: {
                url: string
            }
        }
    },
    metadata: {
        assetId: string,
        assetType: string,
        contractAddress: string,
    },
    buyTokenConfigs: BuyTokenConfig[]
    assetType: string,
    assetRefs: {
        id: number,
        type: string,
        destAsset: {
            data: {
                attributes: ChainAsset,
                id: number
            }
        }
    }[]
}

export interface Chain {
    id: string,
    name: string,
    slug: string,
    isTestnet: boolean,
    symbol: string,
    icon: {
        data: {
            attributes: {
                url: string
            }
        }
    },
    substrateInfo: {
        symbol: string,
        relaySlug: string,
        paraId: number,
        genesisHash: string,
        addressPrefix: string,
        chainType: string,
        crowdloanParaId: number,
        crowdloanUrl: string,
        blockExplorer: string,
        decimals: number,
        existentialDeposit: string,
        hasNativeNft: boolean,
        supportStaking: boolean,
        supportSmartContract: any
    },
    evmInfo: {
        symbol: string,
        evmChainId: number,
        decimals: number,
        blockExplorer: string,
        apiExplorer: string,
        existentialDeposit: string,
        supportSmartContract: any
    },
    providers: Provider[],
    chainAsset: ChainAsset[],
    crowdLoanList: CrowdloanType[],
}


export enum ConnectionStatus {
    CONNECTED = 'CONNECTED',
    FAIL = 'FAIL',
    CHECKING = 'CHECKING',
}

export interface ProviderCollection {
    url: string;
    status: ConnectionStatus;
}


export enum ChainType {
    EVM = 'EVM',
    SUBSTRATE = 'SUBSTRATE',
}

export interface ChainTagType {
    label: string;
    icon: React.ReactNode;
    color: TagProps['color'];
    weight: IconProps['weight'];
}

export interface ProviderConnectionType {
    label: string;
    color: TagProps['color'];
}

export interface CrowdloanTagType {
    label: string;
    color: TagProps['color'];
    icon: PhosphorIcon;
    weight: IconProps['weight'];
}


export enum StatusIconEnum {
    SUCCESS = 'success',
    FAIL = 'fail',
    DEFAULT = 'default',
}

export interface StatusIconType {
    color: TagProps['color'];
    icon: PhosphorIcon;
}

export interface DataType {
    id: number;
    attributes: any;
}

export interface ResponseDataType {
    data: DataType[]
}

export interface ResultType {
    hasNotReceivedFaucet: boolean,
    accountReceived: boolean,
    accountSent: boolean,
    accountReceivedNative: boolean,
    validSignature: boolean,
    transaction: boolean,
    txHash: string,
    error?: boolean,
}
