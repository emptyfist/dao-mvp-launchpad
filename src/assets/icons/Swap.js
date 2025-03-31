import React from 'react';

const Swap = ({fill='#5FD2A2'}) => {
    return (
        <svg width="35" height="20" viewBox="0 0 35 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="8.39844" y1="17.1945" x2="8.39844" y2="0.999998" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <line x1="7.95102" y1="18.6479" x2="0.99909" y2="11.696" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="-1" x2="10.8315" y2="-1" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 7.13086 18.6479)" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="-1" x2="17.1945" y2="-1" transform="matrix(0 1 1 0 27.3984 1.45343)" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <line x1="1" y1="-1" x2="10.8315" y2="-1" transform="matrix(-0.707107 0.707107 0.707107 0.707107 27.3652 1)" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
            <line x1="26.5451" y1="1" x2="33.497" y2="7.95193" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
        </svg>

    );
};

export default Swap;
