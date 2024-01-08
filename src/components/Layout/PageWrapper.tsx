import React, {useContext} from 'react';
import { Await } from 'react-router-dom';
import styled from 'styled-components';
import {ThemeProps} from "../../types";
import LoadingScreen from "../LoadingScreen";
import {DataContext} from "../../providers/DataContext";

export interface PageWrapperProps extends ThemeProps{
  resolve?: Promise<any>;
  children?: React.ReactNode;
  animateOnce?: boolean;
  loadingClass?: string;
}

function Component ({  children, className, loadingClass, resolve }: PageWrapperProps) {
  const nodeRef = React.useRef(null);
  const {getData} = useContext(DataContext);

  return <React.Suspense fallback={<LoadingScreen className={loadingClass} />}>
    <Await resolve={getData}>
      <div
          className={className}
          ref={nodeRef}
        >
          {children}
        </div>
    </Await>
  </React.Suspense>;
}

const PageWrapper = styled(Component)<PageWrapperProps>(({ theme }) => ({
  height: '100%',

  '&__inner': {
    height: '100%'
  }
}));

export default PageWrapper;
