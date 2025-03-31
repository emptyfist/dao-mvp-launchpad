import clsx from 'clsx';
import { useLocation } from 'react-router';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
import { EllipseButton, SimpleButton, ExternalLink } from '../reusable';
import { useWidth } from '../../hooks';
import { OtarisFullLogo } from '../../assets/logos';
import { ArrowDown, Medium, Telegram, Twitter, Discord } from '../../assets/icons';
import { navigations } from '../../config/navigations';
import { LAPTOP_WIDTH } from '../../config/constants';

const SPMenu = ({ open, onClose }) => {
    const windowWidth = useWidth();
    const location = useLocation();
    let navigate = useNavigate();

    return (
        <div className={clsx('spmenu', open && windowWidth <= LAPTOP_WIDTH ? 'shown' : '')}>
            <div className="sp-menu-logo-wrapper">
                <a href="/#">
                    <OtarisFullLogo width={250} height={45} />
                    {/* <Logo width="50" height="50" /> */}
                </a>
            </div>
            <div className="divider-wrapper" />
            <div className="sp-menu-wrapper">
                {navigations.map((navItem) => (
                    <div
                        className={`navbar-item ${navItem.disabled ? 'disabled' : ''} 
                    ${location.pathname.startsWith(navItem.link) ? 'active' : ''}`}
                        key={navItem.title}
                    >
                        {navItem.title === '' ? (
                            <div />
                        ) : !navItem.external ? (
                            <Link
                                to={navItem.link}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate(navItem.link);
                                    onClose();
                                }}
                            >
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
            </div>
            <div className="divider-wrapper" />
            <div className="sp-social-wrapper">
                <ExternalLink to="https://discord.gg/otaris">
                    <EllipseButton>
                        <Discord fill="#3BDCB1" />
                    </EllipseButton>
                </ExternalLink>
                <ExternalLink to="https://t.me/otaris">
                    <EllipseButton>
                        <Telegram fill="#3BDCB1" />
                    </EllipseButton>
                </ExternalLink>
                <ExternalLink to="https://otaris.medium.com/">
                    <EllipseButton className="medium-btn">
                        <Medium fill="#3BDCB1" />
                    </EllipseButton>
                </ExternalLink>
                <ExternalLink to="https://twitter.com/otaris_io">
                    <EllipseButton className="twitter-btn">
                        <Twitter fill="#3BDCB1" />
                    </EllipseButton>
                </ExternalLink>
            </div>
            <div className="sp-button-wrapper">
                <div style={{ transform: 'rotate(-180deg)' }}>
                    <ArrowDown />
                </div>
                <SimpleButton clickHandler={(e) => onClose()}>
                    <div>Close Menu</div>
                </SimpleButton>
            </div>
        </div>
    );
};

export default SPMenu;
