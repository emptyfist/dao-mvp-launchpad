import ReactTooltip from 'react-tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { CustomSelect, CustomCheck, ImageUpload, SimpleButton, CardWrapper } from '../reusable';
import { useWidth } from '../../hooks';
import { hasError } from '../../helpers/functions';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { useGlobalContext } from '../../context/global/GlobalState';
import DocumentPreview from '../../assets/svg/document-preview.svg';
import PassportPreview from '../../assets/svg/passport-preview.svg';
import DocumentPreviewSp from '../../assets/svg/document-preview-sp.svg';
import PassportPreviewSp from '../../assets/svg/passport-preview-sp.svg';
import { Loading3Dot } from '../../assets/loading';
import { KYC_STATUS, PHABLET_WIDTH, ID_TYPE_NONE, ID_TYPE_DOCUMENT, ID_TYPE_PASSPORT } from '../../config/constants';

const documentOptions = [
    { value: ID_TYPE_DOCUMENT, label: 'ID Document' },
    { value: ID_TYPE_PASSPORT, label: 'Passport' },
];

const UploadDocument = ({ nextHandler }) => {
    const { kycStatus, kycInfo, setKYCInfo, isKYCSubmitting } = useGlobalContext();

    const [isValidate, setValidate] = useState(false);
    const [isAgree, setAgree] = useState(false);
    const [wrongCountry, setWrongCountry] = useState(false);
    const [allCountries, setAllCountries] = useState([]);

    const isMounted = useRef(true);
    const windowWidth = useWidth();

    const onNextClicked = (e) => {
        nextHandler();
    };

    const documentChanged = (selected) => {
        setKYCInfo({ documentType: selected.value });
    };

    const countryChanged = (selected) => {
        if (!selected?.value) return;

        // const isRestricted = salePublic.restrictedCountries.filter((itm) => itm === selected.value);

        // if (isRestricted.length > 0) {
        //     setWrongCountry(true);
        //     setKYCInfo({ countryId: '' });
        //     toast.error('Unfortunately residents of this country will NOT be able to participate in the Otaris sale.');
        // } else {
        setWrongCountry(false);
        setKYCInfo({ countryId: selected.value });
        // }
    };

    const setFrontImage = (name, val) => {
        setKYCInfo({
            front: val,
            frontName: name,
        });
    };

    const setBackImage = (name, val) => {
        setKYCInfo({
            back: val,
            backName: name,
        });
    };

    const setSelfieImage = (name, val) => {
        setKYCInfo({
            selfie: val,
            selfieName: name,
        });
    };

    const checkIsDisabled = () => {
        if (isKYCSubmitting || kycStatus === KYC_STATUS.VERIFIED) return true;
        return false;
    };

    const getDefaultObject = (type, val) => {
        let findItm = null;
        if (type === 'Type') findItm = documentOptions.find((itm) => itm.value === val);
        else findItm = allCountries.find((itm) => itm.value === val);

        return findItm;
    };

    useEffect(() => {
        if (!kycInfo.firstName || !kycInfo.lastName || !kycInfo.countryId || !kycInfo.selfie) {
            setValidate(false);
            return;
        }

        if (kycInfo.documentType === ID_TYPE_DOCUMENT && (!kycInfo.front || !kycInfo.back)) {
            setValidate(false);
            return;
        }

        if (kycInfo.documentType === ID_TYPE_PASSPORT && !kycInfo.front) {
            setValidate(false);
            return;
        }

        if (!isAgree) setValidate(false);
        else setValidate(true);

        // eslint-disable-next-line
    }, [isAgree, kycInfo]);

    useEffect(() => {
        const getAllCountries = async () => {
            await fetchWrapper
                .get('/api/Country')
                .then((res) => {
                    const retVal = res
                        .map((itm) => {
                            return { value: itm.id, label: itm.name };
                        })
                        .sort((first, second) => {
                            if (first.label < second.label) return -1;
                            if (first.label > second.label) return 1;

                            return 0;
                        });
                    isMounted.current && setAllCountries(retVal);
                })
                .catch((msg) => {
                    console.log(msg);
                });
        };
        getAllCountries();

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line
    }, []);

    return (
        <CardWrapper title="Upload Documents">
            <div className="kyc-upload-documents">
                <div className="two-child-wrapper">
                    <div className="input-with-label">
                        <span className="input-label-title">ID Type</span>
                        <CustomSelect
                            defaultValue={getDefaultObject('Type', kycInfo.documentType)}
                            options={documentOptions}
                            placeHolder="Select ID"
                            changeHandler={documentChanged}
                            isDisabled={checkIsDisabled()}
                        />
                    </div>
                    <div className="input-with-label">
                        <span className="input-label-title">Country that issued the ID</span>
                        <CustomSelect
                            defaultValue={getDefaultObject('Country', kycInfo.countryId)}
                            options={allCountries}
                            placeHolder="Select Country"
                            changeHandler={countryChanged}
                            isAlert={wrongCountry || hasError(kycInfo.errors, 'country') !== false}
                            isDisabled={checkIsDisabled()}
                            isClearable={true}
                        />
                        {hasError(kycInfo.errors, 'country') !== false && (
                            <span className="input-label-error">{hasError(kycInfo.errors, 'country')}</span>
                        )}
                    </div>
                </div>
                {kycInfo.documentType !== ID_TYPE_NONE && (
                    <div className="document-select-wrapper">
                        <span className="input-label-title">Attested document (both sides) *</span>
                        <span className="remark-caption">
                            This image should contain a clear photo of you holding your chosen ID document. Your ID
                            document has to be readable on the photo.
                        </span>
                        {kycInfo.documentType === ID_TYPE_DOCUMENT && (
                            <>
                                <ImageUpload
                                    defaultName={kycInfo.frontName}
                                    setImage={setFrontImage}
                                    placeHolder="Front Side (5MB limit)"
                                    isDisabled={checkIsDisabled()}
                                    isAlert={hasError(kycInfo.errors, 'Document')}
                                />
                                <ImageUpload
                                    defaultName={kycInfo.backName}
                                    setImage={setBackImage}
                                    placeHolder="Back Side (5MB limit)"
                                    isDisabled={checkIsDisabled()}
                                    isAlert={hasError(kycInfo.errors, 'Document')}
                                />
                                {hasError(kycInfo.errors, 'Document') !== false && (
                                    <span className="label-has-error">{hasError(kycInfo.errors, 'Document')}</span>
                                )}
                                {kycInfo.front === null && kycInfo.back === null ? (
                                    <div className="upload-preview">
                                        <img className="document-preview-img" src={DocumentPreview} alt="preview" />
                                        <img
                                            className="document-preview-sp-img"
                                            src={DocumentPreviewSp}
                                            alt="preview-sp"
                                        />
                                        <span className="tips">
                                            {
                                                'Provide a photo which contains:\r\n・a photo of the front of your ID,\r\n・alongside a piece of paper with your signature and date on it.\r\n\r\nIf your ID has two sides, please provide an additional photo of the back of your ID, with a piece of paper with your signature and date on it.'
                                            }
                                        </span>
                                    </div>
                                ) : (
                                    <div className="document-preview-wrapper">
                                        <div>
                                            <img
                                                src={kycInfo.front}
                                                alt="document-front"
                                                style={{
                                                    display: kycInfo.front === null ? 'none' : 'block',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <img
                                                src={kycInfo.back}
                                                alt="document-back"
                                                style={{
                                                    display: kycInfo.back === null ? 'none' : 'block',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {kycInfo.documentType === ID_TYPE_PASSPORT && (
                            <>
                                <ImageUpload
                                    defaultName={kycInfo.frontName}
                                    setImage={setFrontImage}
                                    placeHolder="Upload Photo (5MB limit)"
                                    isDisabled={checkIsDisabled()}
                                    isAlert={hasError(kycInfo.errors, 'Document')}
                                />
                                {hasError(kycInfo.errors, 'Document') !== false && (
                                    <span className="label-has-error">{hasError(kycInfo.errors, 'Document')}</span>
                                )}
                                {kycInfo.front === null ? (
                                    <div className="upload-preview">
                                        <img className="passport-preview-img" src={PassportPreview} alt="preview" />
                                        <img
                                            className="passport-preview-sp-img"
                                            src={PassportPreviewSp}
                                            alt="preview"
                                        />
                                        <span className="tips passport">
                                            {
                                                'Provide a photo which contains:\r\n・a photo of your passport,\r\n・alongside a piece of paper with your signature and date on it.'
                                            }
                                        </span>
                                    </div>
                                ) : (
                                    <div className="passport-preview-wrapper">
                                        <img src={kycInfo.front} alt="passport-front" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
                <div className="divider" />
                <div className="photo-wrapper">
                    <span className="input-label-title">Selfie photo holding the chosen ID document *</span>
                    <span className="remark-caption">
                        This image should contain a clear photo of you holding your chosen ID document. Your ID document
                        has to be readable on the photo.
                    </span>
                    <ImageUpload
                        defaultName={kycInfo.selfieName}
                        setImage={setSelfieImage}
                        placeHolder={`${
                            windowWidth < PHABLET_WIDTH
                                ? 'Upload selfie with chosen ID'
                                : 'Please upload a clear photo of you holding the chosen ID document.'
                        }`}
                        isDisabled={checkIsDisabled()}
                        isAlert={hasError(kycInfo.errors, 'Face')}
                    />
                    {hasError(kycInfo.errors, 'Face') !== false && (
                        <span className="label-has-error">{hasError(kycInfo.errors, 'Face')}</span>
                    )}
                    {kycInfo.selfie && (
                        <div className="selfie-preview">
                            <img src={kycInfo.selfie} alt="passport-front" />
                        </div>
                    )}
                </div>
                <div className="agree-wrapper">
                    <CustomCheck
                        caption="I’ve read and accept the Terms & Conditions and Privacy Policy of Otaris *"
                        checkChanged={setAgree}
                    />
                </div>
                <div className="next-step-wrapper">
                    <div />
                    <div data-tip data-for="disabledNextTooltip">
                        <SimpleButton clickHandler={onNextClicked} isDisabled={checkIsDisabled() || !isValidate}>
                            <span>{isKYCSubmitting ? 'Submitting' : 'Submit'}</span>
                            {isKYCSubmitting && (
                                <div className="spinner-wrapper">
                                    <Loading3Dot width={32} height={32} />
                                </div>
                            )}
                        </SimpleButton>
                    </div>
                    <div />
                </div>
                <ReactTooltip className="custom-tooltip" id="disabledNextTooltip" place="bottom" effect="solid">
                    Please fill out all the fields and upload the required documents!
                </ReactTooltip>
            </div>
        </CardWrapper>
    );
};

export default UploadDocument;
