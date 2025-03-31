import React, { useState } from 'react';
import { ConnectWallet, WrongNetwork } from '../modals';
import { SPMenu } from '../layout';
import { EllipseButton, KYCStatusButton, WalletStatusButton } from '../reusable';
import { useWidth } from '../../hooks';
import { PHABLET_WIDTH } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { Hamburger } from '../../assets/icons';
import { OtarisLogo, OtarisFullLogo } from '../../assets/logos';

const Header = () => {
    const [spMenuOpen, setSpMenuOpen] = useState(false);
    const { account, isValidWallet } = useGlobalContext();
    const windowWidth = useWidth();

    return (
        <header className={`${spMenuOpen ? '' : 'sp-invisible'}`}>
            <div className="logo-wrapper">
                <a href="/#" aria-label="Go to Main page">
                    {windowWidth <= PHABLET_WIDTH ? (
                        <div className="sp-logo-wrapper">
                            <OtarisLogo width={45} height={45} />
                        </div>
                    ) : (
                        <div className="lp-logo-wrapper">
                            <OtarisFullLogo width={200} height={45} />
                        </div>
                    )}
                </a>
            </div>

            <div className="auth-wrapper">
                {account && isValidWallet && <KYCStatusButton />}

                <WalletStatusButton />
                {account && isValidWallet && (
                    <div className="hamburger-wrapper">
                        <EllipseButton clickHandler={(e) => setSpMenuOpen(true)}>
                            <Hamburger />
                        </EllipseButton>
                    </div>
                )}
            </div>
            {account && isValidWallet && <SPMenu open={spMenuOpen} onClose={() => setSpMenuOpen(false)} />}
            <ConnectWallet />
            <WrongNetwork />
        </header>
    );
};

export default Header;
