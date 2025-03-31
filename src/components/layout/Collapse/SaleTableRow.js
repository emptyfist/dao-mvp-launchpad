import moment from 'moment';
import React from 'react';
import OtarisLogo from '../../../assets/icons/tokens/otaris.svg';
import { formatterInt } from '../../../helpers/functions';
const SaleTableRow = ({ row }) => {
    return (
        <div className="sort-table-row sale">
            <div className="sort-table-cell sales-pool-logo">
                <img src={OtarisLogo} alt="otaris" />
                <div className="logo-caption">
                    <span className="name">{row.name}</span>
                    <span className="desc">{row.desc}</span>
                </div>
            </div>
            <div className="sort-table-cell">{row.status}</div>
            <div className="sort-table-cell">{moment(row.part).format('D MMM YYYY')}</div>
            <div className="sort-table-cell">{`${formatterInt.format(row.tokens)}/${formatterInt.format(
                row.usd
            )}`}</div>
            <div className="sort-table-cell">
                <span className="action-button">Claim</span>
            </div>
        </div>
    );
};

export default SaleTableRow;
