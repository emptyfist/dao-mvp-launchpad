import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { SimpleButton } from '../reusable';
import { ArrowDown, ExpandArrow } from '../../assets/icons';

const ExpandableArea = ({
    children,
    isCollapsed,
    changeCollapseStatus,
    isDisabled = false,
    maxHeight = 0,
    isTop = false,
    ...rest
}) => {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        isCollapsed && setCollapsed(isCollapsed());
    }, [isCollapsed]);
    return (
        <div className="expandable-area" {...rest}>
            {maxHeight === 0 ? (
                <div className={clsx('child-area', collapsed ? 'collapsed' : '')}>{children}</div>
            ) : (
                <div
                    className={clsx('child-area', collapsed ? 'collapsed' : '')}
                    style={{ maxHeight: `${collapsed ? 0 : maxHeight}px` }}
                >
                    {children}
                </div>
            )}
            {!isTop ? (
                <SimpleButton
                    clickHandler={() => setCollapsed(!collapsed)}
                    className={clsx('toggle-button', collapsed ? 'collapsed' : '')}
                >
                    {collapsed ? 'More' : 'Less'}
                </SimpleButton>
            ) : (
                <div
                    className="control-area"
                    style={{ transform: `rotate(${collapsed ? 0 : 180}deg)` }}
                    onClick={() => {
                        if (isDisabled) return;
                        changeCollapseStatus && changeCollapseStatus(!collapsed);
                    }}
                >
                    {!isTop ? <ExpandArrow /> : <ArrowDown width={16} height={16} />}
                </div>
            )}
        </div>
    );
};

export default ExpandableArea;
