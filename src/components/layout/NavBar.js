import ReactTooltip from 'react-tooltip';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import React from 'react';
import { navigations } from '../../config/navigations';

const NavBar = () => {
    const location = useLocation();

    return (
        <div className="navbar-wrapper">
            <div className="navbar-content">
                {navigations.map((navItem) => (
                    <div
                        data-tip
                        data-for={`${navItem.disabled ? 'disabledMenuTip' : ''}`}
                        className={`navbar-item ${navItem.disabled ? 'disabled' : ''} 
                        ${location.pathname.startsWith(navItem.link) ? 'active' : ''}`}
                        key={navItem.title}
                    >
                        {navItem.title === '' ? (
                            <div style={{ height: '2rem' }} />
                        ) : !navItem.external ? (
                            <Link to={navItem.link}>
                                {React.createElement(navItem.icon, {})}
                                <span>{navItem.title}</span>
                            </Link>
                        ) : (
                            <a href={navItem.link} target="_blank" rel="noreferrer">
                                {React.createElement(navItem.icon, {})}
                                <span>{navItem.title}</span>
                            </a>
                        )}
                    </div>
                ))}
                <ReactTooltip className="custom-tooltip" id="disabledMenuTip" place="left" effect="solid">
                    Coming Soon
                </ReactTooltip>
            </div>
        </div>
    );
};

export default NavBar;
