import React from 'react';
import { useParams } from 'react-router-dom';
import { SaleDetail } from '../sales';

const Sale = () => {
    let { saleId } = useParams();
    return <SaleDetail saleId={saleId} />;
};

export default Sale;
