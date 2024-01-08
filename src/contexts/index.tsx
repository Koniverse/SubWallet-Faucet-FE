// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {createContext} from 'react';
import {NotificationInstance} from "@subwallet/react-ui/es/notification/interface";
export interface AppContextType {
}

export const NotificationContext = createContext<NotificationInstance>({} as unknown as NotificationInstance)
