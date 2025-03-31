import React from 'react';
import { NavBar } from '../layout';

const Contents = ({ children }) => {
    return (
        <div className="contents-wrapper">
            <div className="container">
                <NavBar />
                {children}
            </div>
        </div>
    );
};

export default Contents;
