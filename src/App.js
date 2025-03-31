import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Layout } from './components/layout';
import TimerProvider from './context/timer/TimerState';
import GlobalProvider from './context/global/GlobalState';
import SaleState from './context/sale/SaleState';
import ModalProvider from './context/modal/ModalState';
import { LoadingBlocksWave } from './assets/loading';
import './App.scss';

const Sales = lazy(() => import('./components/pages/Sales'));
const Sale = lazy(() => import('./components/pages/Sale'));
const Membership = lazy(() => import('./components/pages/Membership'));
const Staking = lazy(() => import('./components/pages/Staking'));
const Farming = lazy(() => import('./components/pages/Farming'));
const KYC = lazy(() => import('./components/pages/KYC'));
const WhiteList = lazy(() => import('./components/pages/Whitelist'));
const EmailVerify = lazy(() => import('./components/pages/EmailVerify'));

function App() {
    return (
        <TimerProvider>
            <GlobalProvider>
                <ModalProvider>
                    <SaleState>
                        <BrowserRouter>
                            <Suspense
                                fallback={
                                    <div className="page-loading">
                                        <LoadingBlocksWave width={48} height={48} />
                                    </div>
                                }
                            >
                                <Routes>
                                    <Route path="/emailverify" element={<EmailVerify />} />
                                    <Route element={<Layout />}>
                                        <Route path="/sales" element={<Sales />} />
                                        <Route path="/sales/:saleId" element={<Sale />} />
                                        <Route path="/whitelist" element={<WhiteList />} />
                                        <Route path="/farming" element={<Farming />} />
                                        <Route path="/staking" element={<Staking />} />
                                        <Route path="/member" element={<Membership />} />
                                        <Route path="/member/kyc" element={<KYC />} />
                                        <Route path="*" element={<Navigate to="/sales" replace />} />
                                    </Route>
                                </Routes>
                            </Suspense>
                            <Toaster
                                position="top-right"
                                reverseOrder={false}
                                toastOptions={{
                                    duration: 5000,
                                    style: {
                                        position: 'relative',
                                        top: '4rem',
                                        right: '1.5rem',
                                        margin: '5px 0',
                                        padding: '.7rem 1.5rem',
                                        color: 'white',
                                        fontSize: '16px',
                                        borderRadius: '20px',
                                        border: '2px solid #10172a',
                                        boxShadow:
                                            '0px 0px 0px 1.6px #1A2238, -4px -4px 8px rgba(255, 255, 255, 0.1), 4px 8px 8px rgba(1, 7, 19, 0.2)',
                                        background: 'linear-gradient(135deg, #35405b 0%, #222c45 100%)',
                                    },
                                }}
                            />
                        </BrowserRouter>
                    </SaleState>
                </ModalProvider>
            </GlobalProvider>
        </TimerProvider>
    );
}

export default App;
