import clsx from 'clsx';
import React from 'react';
import { ArrowDown, Filter } from '../../assets/icons';

const FilterButton = ({ className, isOpen, statusChanged }) => {
    const btnClicked = (e) => {
        if (statusChanged) {
            statusChanged(!isOpen, e.currentTarget.parentElement.parentElement.parentElement.offsetTop);
        }
    };

    return (
        <button
            className={clsx('btn-wrapper simple-btn-wrapper secondary-btn btn-box-shadow filter-btn', className)}
            onClick={btnClicked}
        >
            <Filter fill={isOpen ? '#3BDCB1' : '#FFF'} />
            <div style={{ transform: `rotate(${!isOpen ? '0' : '-180'}deg)` }}>
                <ArrowDown />
            </div>
        </button>
    );
};

export default FilterButton;
