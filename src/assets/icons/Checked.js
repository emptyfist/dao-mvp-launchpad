import React from 'react';

const Checked = ({ fill, width, height }) => {
    return (
        <svg
            width={width ? width : '11'}
            height={height ? height : '11'}
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M10.7963 6.23324C10.613 5.78113 10.613 5.28014 10.7963 4.84025L10.8574 4.69362C11.2483 3.76496 10.7963 2.68967 9.86776 2.29865L9.73337 2.23755C9.28132 2.05427 8.92702 1.69991 8.74375 1.2478L8.69488 1.12561C8.2917 0.196944 7.22878 -0.242948 6.28803 0.135848L6.16585 0.184725C5.71381 0.368014 5.21289 0.368014 4.76084 0.184725L4.65088 0.135848C3.73457 -0.242948 2.65943 0.209164 2.26847 1.13782L2.2196 1.23558C2.03633 1.68769 1.68202 2.04205 1.22998 2.22534L1.12002 2.27421C0.203704 2.66523 -0.248345 3.74052 0.142616 4.66918L0.191486 4.77915C0.374749 5.23126 0.374749 5.73225 0.191486 6.17215L0.142616 6.30656C-0.248345 7.23522 0.191486 8.31051 1.13224 8.68931L1.25441 8.73818C1.70646 8.92147 2.06077 9.27583 2.24403 9.72794L2.30512 9.86235C2.68386 10.8032 3.759 11.2431 4.68753 10.8643L4.82193 10.8032C5.27398 10.6199 5.77489 10.6199 6.22694 10.8032L6.3369 10.8521C7.26543 11.2431 8.34057 10.791 8.73153 9.86235L8.78041 9.7646C8.96367 9.31249 9.31798 8.95813 9.77002 8.77484L9.86776 8.73818C10.8085 8.34717 11.2483 7.28409 10.8574 6.34321L10.7963 6.23324ZM4.98076 7.88284L2.59834 5.87888L3.33139 5.01132L4.84636 6.29434L7.522 3.11734L8.38944 3.85049L4.98076 7.88284Z"
                fill={fill ?? ''}
            />
        </svg>
    );
};

export default Checked;
