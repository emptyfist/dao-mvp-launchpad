import React from 'react';

const ContentHeader = ({icon, title, children}) => {
    return (
        <div className='content-header'>
            {React.createElement(icon, {})}
            <span>{title}</span>
            <div className='space-gap' />
            {children}
        </div>
    );
};

export default ContentHeader;
