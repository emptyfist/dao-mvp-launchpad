import React from 'react';
import { ExternalLink } from '../reusable';
import Lambo from '../../assets/png/lambo.webp';

const Footer = () => {
    return (
        <footer>
            <div className="copyrights">
                <span>
                    Powered by <ExternalLink to="https://www.faculty.group/">Faculty Group.</ExternalLink>
                </span>
                <span>© 2022 Otaris. All rights reserved.</span>
            </div>
            <div className="lambo-wrapper">
                <img src={Lambo} alt="lambo" />
            </div>
            <div className="terms-policy">
                <div className="terms-content">
                    <ExternalLink to="https://otaris.io/privacypolicy/">Privacy Policy</ExternalLink>
                    <ExternalLink to="https://otaris.io/termsofuse/">Terms of Use</ExternalLink>
                </div>
            </div>
            <div className="footer-mask" />
        </footer>
    );
};

export default Footer;
