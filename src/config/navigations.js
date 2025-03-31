import { Docs, Info, Membership, Farming, Staking, Ido } from '../assets/icons';
import { OtarisLogo } from '../assets/logos';

export const navigations = [
    {
        title: 'Sales',
        link: '/sales',
        icon: Ido,
        external: false,
        disabled: false,
    },
    {
        title: 'Staking',
        link: '/staking',
        icon: Staking,
        external: false,
        disabled: false,
    },
    {
        title: 'Farming',
        link: '/farming',
        icon: Farming,
        external: false,
        disabled: false,
    },
    {
        title: 'Membership',
        link: '/member',
        icon: Membership,
        external: false,
        disabled: false,
    },
    {
        title: 'Apply for IDO',
        link: 'https://otaris.io/',
        icon: OtarisLogo,
        external: true,
        disabled: false,
    },
    { title: '' },
    {
        title: 'Info',
        link: 'https://otaris.io',
        icon: Info,
        external: true,
        disabled: false,
    },
    {
        title: 'Docs',
        link: 'https://docs.otaris.io/',
        icon: Docs,
        external: true,
        disabled: false,
    },
];
