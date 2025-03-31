import React, { useEffect, useState } from 'react';
import useWidth from '../../../hooks/useWidth';
import SortSvg from '../../../assets/svg/sort.svg';
import { PHABLET_WIDTH } from '../../../config/constants';

const TableHeader = ({ getColumns, setOrder, className }) => {
    const [columns, setColumns] = useState([]);
    const windowWidth = useWidth();
    useEffect(() => {
        setColumns(getColumns());
    }, [getColumns]);

    return (
        <div className={`sort-table-header sort-table-row ${className}`}>
            {columns.map((itm) => (
                <div
                    key={itm.key}
                    className="sort-table-cell header"
                    onClick={(e) => {
                        if (!itm.sortable) return;
                        setOrder(itm.key, itm.order === 'desc' ? 'asc' : 'desc');
                    }}
                >
                    <span>
                        {windowWidth <= PHABLET_WIDTH && itm.text === 'Unclaimed Rewards' ? 'Unclaimed' : itm.text}
                    </span>
                    {itm.sortable && (
                        <img
                            src={SortSvg}
                            alt="sort order"
                            style={{ transform: `rotate(${itm.order === 'desc' ? 0 : 180}deg)` }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default TableHeader;
