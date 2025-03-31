import clsx from 'clsx';
import React, { useRef } from 'react';
import SearchIcon from '../../assets/svg/search.svg';

const SearchInput = ({ placeHolder, setChanged, isMarketplace = false, ...rest }) => {
    const searchRef = useRef();

    const keyPressed = (e) => {
        if (e.keyCode !== 13 || !setChanged) return;

        setChanged(searchRef.current.value);
    };

    return (
        <div className="search-input-wrapper" {...rest}>
            <input
                type="text"
                ref={searchRef}
                placeholder={placeHolder}
                onKeyDown={keyPressed}
                className={clsx('', `${!isMarketplace ? '' : 'marketplace'}`)}
            />
            <div className="suffix-container">
                <img src={SearchIcon} alt="search-svg" />
            </div>
        </div>
    );
};

export default SearchInput;
