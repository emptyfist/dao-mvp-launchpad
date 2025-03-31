import React, { useState } from 'react';

const TabSlider = ({ tabs, tabChanged, defaultVal = null, ...rest }) => {
    const [currentTab, setCurrentTab] = useState(defaultVal ?? (tabs && tabs.length > 0 ? tabs[0] : ''));
    const tabSelected = (val) => {
        setCurrentTab(val);
        if (tabChanged) tabChanged(val);
    };

    const getCurrentPosition = () => {
        if (!tabs || tabs.length < 1) return 0;

        const tabPos = tabs.findIndex((tab) => tab === currentTab);
        return tabPos === -1 ? 0 : tabPos;
    };

    return (
        <div className="tab-slider-wrapper" {...rest}>
            {tabs.map((tab) => (
                <span
                    onClick={() => tabSelected(tab)}
                    style={{
                        width: `calc(100% / ${tabs && tabs.length > 0 ? tabs.length : 1})`,
                        fontWeight: currentTab === tab ? '600' : '400',
                        color: currentTab === tab ? '#FFF' : '#FFFFFF80',
                    }}
                    key={tab}
                >
                    {tab}
                </span>
            ))}
            <div
                className="animated-bg"
                style={{
                    width: `calc(100% / ${tabs && tabs.length > 0 ? tabs.length : 1})`,
                    transform: `translate(${getCurrentPosition() * 100}%)`,
                }}
            />
        </div>
    );
};

export default TabSlider;
