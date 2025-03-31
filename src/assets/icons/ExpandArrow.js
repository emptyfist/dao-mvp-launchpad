import React from 'react';

const ExpandArrow = ({ fill }) => {
    return (
        <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* <circle cx="13.1329" cy="12.3942" r="12.172" fill="#11A3B7" /> */}
            <circle cx="13.1329" cy="12.3942" r="12.172" fill={fill} />
            <path
                d="M9.45117 11.2898L13.1329 14.9715L16.8146 11.2898"
                stroke="#192137"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default ExpandArrow;
