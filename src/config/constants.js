export const networks = {
    MainNet: 1,
    Ropsten: 3,
    Rinkeby: 4,
    Goerli: 5,
    Kovan: 42,
    Polygon: 137,
    PolygonDev: 138,
    EWC: 246,
    Sepolia: 11155111,
};

export const NETWORK_NAME = {
    1: 'MainNet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    42: 'Kovan',
    137: 'Polygon',
    138: 'PolygonDev',
    246: 'EWC',
    11155111: 'Sepolia',
};

export const SIGN_TEXT = `Message:
    Welcome to Otaris.io!

    This request will not trigger a blockchain transaction or cost any gas fees.

    Your authentication status will reset after 24 hours.
    
`;

export const RET_STATUS_OK = 'ok';

export const SALE_STATUS = {
    New: -1,
    Open: 0,
    Closed: 1,
    Round1: 2,
    Round1End: 3,
    Round2: 4,
    Round2End: 5,
    Round3: 6,
    Round3End: 7,
    Claiming: 8,
    ClaimingEnds: 9,
    ClaimingRefund: 10,
    ClaimingRefundEnd: 11,
};

export const CONTROL_BUTTON_STATUS = {
    None: 0,
    Approving: 1,
    Contributing: 2,
    Claiming: 3,
};

export const SALE_GOING_STATUS = {
    None: 'None',
    Ongoing: 'Live',
    Upcoming: 'Upcoming',
    Completed: 'Completed',
};

export const SALE_BOARD_STATUS = {
    Upcoming: 'Upcoming',
    Ongoing: 'Ongoing',
    Completed: 'Completed',
    Refund: 'Refund',
};

export const LAPTOP_WIDTH = 1120;
export const TABLET_WIDTH = 900;
export const PHABLET_WIDTH = 768;
export const MOBILE_WIDTH = 500;

export const MEMBERSHIP_STATUS = {
    Senator: 4,
    Ambassador: 3,
    Officer: 2,
    Citizen: 1,
    Visitor: 0,
};

export const SALE_TYPE = {
    Private: 'Private',
    TierBased: 'TierBased',
    Unlimited: 'Unlimited',
};

export const SALE_STEP = {
    WhiteList: 'Whitelisting',
    Sale: 'Sale',
    Claiming: 'Claiming',
};

export const KYC_STATUS = {
    NONE: 'None',
    UNVERIFIED: 'Unverified',
    VERIFYING: 'Verifying...',
    VERIFIED: 'Verified',
    FAILED: 'Failed',
};

export const ID_TYPE_NONE = 'NONE   ';
export const ID_TYPE_DOCUMENT = 'ID_CARD';
export const ID_TYPE_PASSPORT = 'PASSPORT';

export const KYC_VERIFY_STEP = {
    SUBMIT_INFO: 'Submit personal info',
    SUBMIT_QUIZ: 'Answer quiz',
};

////////////////////////
// for public : temporary

export const WHITELISTSTATUS = {
    NotSubmitted: 1,
    Submitted: 2,
    Pending: 3,
    Closed: 4,
};

export const ROUND1STATUS = {
    NotContribute_1st: 1,
    ContributeNotMax_1st: 2,
    ContributeMax_1st: 3,
};

export const ROUND2STATUS = {
    NotContribute_2nd: 1,
    ContributeNotMax_2nd: 2,
    ContributeMax_2nd: 3,
};

export const CLAIMSTATUS = {
    SaleComplete: 1,
    ClaimSoon: 2,
    Claim: 3,
    Claimed: 4,
};
