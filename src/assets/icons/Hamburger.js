import React from 'react';

const Hamburger = ({fill='#fff'}) => {
    return (
        <svg 
            width='25' 
            height='17' 
            viewBox='0 0 25 17' 
            fill='none' 
            xmlns='http://www.w3.org/2000/svg'
        >
            <path d='M1.54688 8.65674H23.2326' stroke={fill??''} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
            <path d='M1.54688 1.42871H23.2326' stroke={fill??''} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
            <path d='M1.54688 15.8857H23.2326' stroke={fill??''} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
        </svg>
    );
};

export default Hamburger;
