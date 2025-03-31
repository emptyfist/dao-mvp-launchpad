import React from 'react';
import tokenInfo from '../../../config/tokenInfo';

const POOL_TYPE_FARMING = 'Farming';
const formatterInt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const StakeTableRow = ({ row }) => {
    return (
        <div className="sort-table-row stake">
            <div className="sort-table-cell">
                <div className="token-logo-wrapper">
                    {row.type === POOL_TYPE_FARMING ? (
                        <div className="token-pair">
                            <div className={`token-logo ${row.token1 !== 'OTA' ? 'bg-dark' : ''}`}>
                                <img src={tokenInfo[row.token1].icon} alt={row.token1} />
                            </div>
                            <div className={`token-logo ${row.token2 !== 'OTA' ? 'bg-dark' : ''}`}>
                                <img src={tokenInfo[row.token2].icon} alt={row.token2} />
                            </div>
                        </div>
                    ) : (
                        <div className={`token-logo ${row.token2 !== 'OTA' ? 'bg-dark' : ''}`}>
                            <img src={tokenInfo[row.token2].icon} alt={row.token2} />
                        </div>
                    )}
                </div>
                <div className="logo-caption">
                    <span className="name">{row.name}</span>
                    <span className="desc">{row.type === POOL_TYPE_FARMING ? row.desc : `GET ${row.token2}`}</span>
                </div>
            </div>
            <div className="sort-table-cell">{row.type}</div>
            <div className="sort-table-cell">
                {row.type === POOL_TYPE_FARMING
                    ? `${formatterInt.format(row.bal)} ${row.token1}-${row.token2}`
                    : `${formatterInt.format(row.bal)} ${row.token1}`}
            </div>
            <div className="sort-table-cell">
                {`${formatterInt.format(row.reward)} ${row.type === POOL_TYPE_FARMING ? row.token1 : row.token2}`}
            </div>
            <div className="sort-table-cell">
                <span className="action-button">Harvest</span>
            </div>
        </div>
    );
};

export default StakeTableRow;
