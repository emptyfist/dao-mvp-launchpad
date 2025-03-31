import clsx from 'clsx';
import toast from 'react-hot-toast';
import React, { useEffect, useRef, useState } from 'react';
import config from '../../config/config';
import Upload from '../../assets/svg/upload.svg';

const ImageUploadComponent = ({
    defaultName,
    setImage,
    className = '',
    placeHolder = '',
    isDisabled = false,
    isAlert = '',
}) => {
    const fileInputRef = useRef();
    const [filename, setFilename] = useState('');

    useEffect(() => {
        setFilename(defaultName);
    }, [defaultName]);

    const fileToDataUri = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });

    const fileSelected = (e) => {
        const files = e.target.files;
        if (!files.length) return;

        if (files[0].size >= config.fileSizeLimit) {
            toast.error('Too large file.');
            return;
        }

        let extension = files[0].name.split('.').pop();
        extension = extension?.toLowerCase();
        if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
            toast.error('Unsupported file is selected. You have to select Image file such as JPEG / JPG / PNG type');
            return;
        }

        setFilename(files[0].name);

        if (setImage) {
            fileToDataUri(files[0]).then((dataUri) => {
                setImage(files[0].name, dataUri);
            });
        }
    };

    return (
        <div className="wrapper-with-error">
            <div className={clsx('image-upload-wrapper', className, isAlert ? 'has-error' : '')}>
                <span className={`filename-wrapper ${filename?.length ? 'white' : ''}`}>
                    {isAlert && !filename ? 'Uploaded' : filename?.length ? filename : placeHolder}
                </span>
                <button
                    className={`image-upload ${isAlert ? 'has-error' : ''}`}
                    onClick={(e) => fileInputRef.current.click()}
                    disabled={isDisabled}
                >
                    <span>Select File</span>
                    <img src={Upload} alt="Upload" />
                </button>
                <input type="file" accept=".jpg,.jpeg,.png" hidden ref={fileInputRef} onChange={fileSelected} />
            </div>
            {/* {isAlert && <span className="label-has-error">{isAlert}</span>} */}
        </div>
    );
};

export default ImageUploadComponent;
