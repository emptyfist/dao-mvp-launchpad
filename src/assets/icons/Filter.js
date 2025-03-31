import React from 'react';

const Filter = ({width=12, height=12, fill='white'}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M0.159471 1.2075C1.90789 3.4425 4.49283 6.75 4.49283 6.75V10.5C4.49283 11.325 5.1711 12 6.00009 12C6.82908 12 7.50734 11.325 7.50734 10.5V6.75C7.50734 6.75 10.0923 3.4425 11.8407 1.2075C12.2251 0.7125 11.8709 0 11.2378 0H0.754837C0.129325 0 -0.22488 0.7125 0.159471 1.2075Z" 
                fill={fill}
            />
        </svg>

    );
};

export default Filter;
