import {Button, Icon} from '@subwallet/react-ui';
import React, {useMemo} from 'react';
import {
    CheckCircle, XCircle, Question
} from 'phosphor-react'
import styled from "styled-components";
import {ThemeProps} from "../../types";
import CN from "classnames";
import {convertHexColorToRGBA} from "../../libs";
import { StatusIconEnum, StatusIconType} from "../../types/dataType";
export enum StatusSize{
    SMALL = 'smail',
    NORMAL = 'normal',
    LARGE = 'large'
}
interface Props extends ThemeProps {
    width?: number | string;
    height?: number | string;
    status?: StatusIconEnum;
    size?: StatusSize;
}


const createColor = (): Record<StatusIconEnum, StatusIconType> => {
    return {
        [StatusIconEnum.DEFAULT]: {
            color: '#D9A33E1A',
            icon: Question,
        },
        [StatusIconEnum.FAIL]: {
            color: 'rgba(191, 22, 22, 0.1)',
            icon: XCircle,
        },
        [StatusIconEnum.SUCCESS]: {
            color: '#4CEAAC1A',
            icon: CheckCircle,
        },
    };
};
const createSize = (): Record<StatusSize, { size: string; iconSize: string  }> => {
    return {
        [StatusSize.SMALL]: {
            iconSize: '13px',
            size: '28px',
        },
        [StatusSize.NORMAL]: {
            iconSize: '13px',
            size: '28px',
        },
        [StatusSize.LARGE]: {
            iconSize: '52px',
            size: '112px',
        },
    };
};



const Component: React.FC<Props> = ({className, status, size}: Props) => {
    const sizeValue = useMemo(() => {
        const sizeTypes = createSize();
        return sizeTypes[size || StatusSize.NORMAL];
    }, [size]);
    const colorValue = useMemo(() => {
        const colorTypes = createColor();
        return colorTypes[status || StatusIconEnum.DEFAULT];
    }, [status]);
    return (
        <Button
                className={CN('__item-icon-button', className, status || StatusIconEnum.DEFAULT)}
                style={{
                    width: sizeValue.size,
                    height: sizeValue.size,
                    minWidth: sizeValue.size,
                }}
                icon={(
                    <Icon
                        className={CN('__item-icon', size?.toString() || StatusSize.NORMAL)}
                        customSize={sizeValue.iconSize}
                        phosphorIcon={colorValue.icon}
                        size={'lg'}
                        weight={'fill'}
                    />
                )}
                onClick={() => []}
                size={'xs'}
                type='ghost'
            />

    );
};
const StatusIcon = styled(Component)<Props>(({theme: {token}}: Props) => {
    return ({
        '&.flex': {
            display: 'flex',
            margin: '0 auto',
        },
        '&.__item-icon-button': {

            borderRadius: '50%',

            '&.success': {
                color: '#4CEAAC',
                backgroundColor: convertHexColorToRGBA('#4CEAAC', 0.1),
            },
            '&.default': {
                background: 'rgba(217, 217, 217, 0.1)',
            },
            '&.withdraw': {
                color: 'rgb(195 142 43)',
                backgroundColor: 'rgb(63 62 58)',
            },
            '&.fail': {
                color: '#E11A1A',
                backgroundColor: convertHexColorToRGBA('#E11A1A', 0.1),
            },
            '.__item-icon.large': {
                height: '52px',
                width: '52px',
            }
        },
    })
})

export default StatusIcon;
