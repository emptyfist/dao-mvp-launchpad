import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { NextSteps } from '../kyc';
import { ArrowLeft } from '../../assets/icons';
import { KYC_VERIFY_STEP } from '../../config/constants';
import { useSaleContext } from '../../context/sale/SaleState';

const Whitelist = () => {
    const [step, setStep] = useState(KYC_VERIFY_STEP.SUBMIT_INFO);
    const { salePublic } = useSaleContext();
    let navigate = useNavigate();

    if (!salePublic.id) navigate('/sales');

    const changeStep = (val) => {
        setStep(val);
    };

    const backClicked = () => {
        navigate(`/sales/${salePublic.id}`);
    };

    return (
        <div id="kyc" className="page">
            <div className="page-title whitelist-header">
                <div className="space-gap" />
                <div className="back-wrapper" onClick={(e) => backClicked()}>
                    <ArrowLeft />
                    <span>Back</span>
                </div>
            </div>
            <div className="page-content">
                <NextSteps current={step} nextHandler={changeStep} contents={salePublic.overview} />
            </div>
        </div>
    );
};

export default Whitelist;
