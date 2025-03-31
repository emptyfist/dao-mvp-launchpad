import React, { useContext, useState } from 'react';
import ModalContext from './ModalContext';

const ModalProvider = ({ children }) => {
    const initialState = {
        connectWallet: false,
        verifyKYCEmail: false,
        contribute: false,
        modalData: null,
        importantNotice: false,
        upgradeNFT: false,
        transactionStatus: false,
        stake: false,
    };

    const [modal, setModal] = useState(initialState);
    const [modalData, setData] = useState(null);

    const openModal = (name) => {
        setModal((prev) => ({ ...prev, [name]: true }));
    };

    const closeModal = (name) => {
        setModal((prev) => ({ ...prev, [name]: false }));
    };

    const setModalData = (data) => {
        setData({ ...data });
    };

    const initModal = () => {
        setModal(initialState);
    };

    return (
        <ModalContext.Provider
            value={{
                modal,
                modalData,
                openModal,
                closeModal,
                setModalData,
                initModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = () => useContext(ModalContext);

export default ModalProvider;
