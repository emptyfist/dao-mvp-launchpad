import React from 'react';

const ExternalLink = ({ to, children, className }) => (
    <a className={className} href={to} target="_blank" rel="noreferrer noopener">
        {children}
    </a>
);

export default ExternalLink;
