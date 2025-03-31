import React from 'react';

const ArrowDown = ({ width, height }) => {
    return (
        <svg
            width={width ? width : '12'}
            height={height ? height : '8'}
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="3.00511"
                y1="2.67532"
                x2="6.18249"
                y2="5.85271"
                stroke="#FFF"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <line
                x1="1.5"
                y1="-1.5"
                x2="5.9935"
                y2="-1.5"
                transform="matrix(-0.707107 0.707107 0.707107 0.707107 11.4805 2.67532)"
                stroke="#FFF"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
};

export default ArrowDown;
