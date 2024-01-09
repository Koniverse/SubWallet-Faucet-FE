import {notification} from "@subwallet/react-ui";
import React, {createContext} from "react";
import {NotificationInstance} from "@subwallet/react-ui/es/notification/interface";

interface Props {
  children: React.ReactElement
}
export const NotificationContext = createContext<NotificationInstance>({} as unknown as NotificationInstance)

export function NotificationProvider({children}: Props) {
  const [notify, contextHolder] = notification.useNotification({
    top: 64
  });

  return <NotificationContext.Provider value={notify}>
    {contextHolder}
    {children}
  </NotificationContext.Provider>
}

export default NotificationProvider;
