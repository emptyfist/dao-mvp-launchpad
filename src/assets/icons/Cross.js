import React from 'react';

const Cross = (props) => {
    return (
        <svg
            width='17'
            height='17'
            viewBox='0 0 17 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
        >
            <line
                x1='2.64844'
                y1='14.6624'
                x2='14.3109'
                y2='2.9999'
                stroke='white'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <line
                x1='1.5'
                y1='-1.5'
                x2='17.9932'
                y2='-1.5'
                transform='matrix(-0.707107 -0.707107 -0.707107 0.707107 13.7842 17)'
                stroke='white'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    );
};

export default Cross;
