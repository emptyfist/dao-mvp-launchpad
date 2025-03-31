import React from 'react';

const CardWrapper = ({ title, children, ...rest }) => (
    <div className="card-wrapper" {...rest}>
        <div className="card-title">{title}</div>
        <div className="card-content">{children}</div>
    </div>
);

export default CardWrapper;
