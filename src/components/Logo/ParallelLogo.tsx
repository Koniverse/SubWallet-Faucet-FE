// Copyright 2019-2022 @polkadot/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

const ParallelLogo: React.FC = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
            background: 'white',
            borderRadius: '50%',
        }}>
            <mask id="mask0_15647_14240" maskUnits="userSpaceOnUse" x="0" y="0" width="24"
                  height="24">
                <path
                    d="M12 0C21.0995 0 24 2.90053 24 12C24 21.0995 21.0995 24 12 24C2.90052 24 0 21.0995 0 12C0 2.90053 2.90052 0 12 0Z"
                    fill="#004BFF"/>
            </mask>
            <g mask="url(#mask0_15647_14240)">
                <rect width="24" height="24" fill="white"/>
            </g>
            <path
                d="M3.49342 13.4265C3.49052 13.4249 3.49052 13.4219 3.49341 13.4203L6.13905 11.9618C6.14127 11.9606 6.14446 11.9606 6.14667 11.9619L12.1129 15.2688C12.1151 15.27 12.1183 15.27 12.1205 15.2688L17.98 11.9898C17.9821 11.9886 17.9853 11.9886 17.9875 11.9898L20.6197 13.4203C20.6226 13.422 20.6226 13.4249 20.6198 13.4266L12.1401 18.2038C12.1379 18.2051 12.1346 18.2051 12.1324 18.2038L3.49342 13.4265Z"
                fill="url(#paint0_linear_15647_14240)"/>
            <path
                d="M3.47584 10.3076C3.47288 10.306 3.47295 10.3029 3.47599 10.3014L12.1148 5.84263C12.117 5.84151 12.12 5.84152 12.1222 5.84265L20.6018 10.3014C20.6047 10.3029 20.6048 10.3059 20.6019 10.3076L12.1223 15.0849C12.1201 15.0861 12.1169 15.0861 12.1146 15.0849L3.47584 10.3076Z"
                fill="url(#paint1_linear_15647_14240)"/>
            <defs>
                <linearGradient id="paint0_linear_15647_14240" x1="7.77032" y1="10.5467" x2="15.774" y2="18.7617"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DD75A6"/>
                    <stop offset="1" stopColor="#F2B05B"/>
                </linearGradient>
                <linearGradient id="paint1_linear_15647_14240" x1="7.77036" y1="7.43757" x2="13.0434" y2="15.3472"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6F73F6"/>
                    <stop offset="1" stopColor="#D975A9"/>
                </linearGradient>
            </defs>
        </svg>


    );
};

export default ParallelLogo;
