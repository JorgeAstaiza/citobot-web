import { INavData } from '@coreui/angular';

// Navegación de Rol ADMIN
export const navItemsAdmin: INavData[] = [
    {
        name: 'Panel Administrativo',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' },
        /* badge: {
                color: 'info',
                text: 'NEW',
            }, */
    },
    {
        name: 'MENÚ',
        title: true,
    },
    {
        name: 'Pacientes',
        url: '/pacientes/consultar',
        iconComponent: { name: 'cilPeople' },
    },
    {
        name: 'Usuarios',
        url: '/usuarios/consultar',
        iconComponent: { name: 'cil-notes' },
    },
    {
        name: 'Tamizaje',
        url: '/tamizaje/consultar',
        iconComponent: { name: 'cil-puzzle' },
    },
    {
        name: 'Riesgos',
        url: '/riesgos/consultar',
        iconComponent: { name: 'cil-bell' },
    },
    {
        name: 'Configuracion',
        url: '/configuracion',
        iconComponent: { name: 'cil-settings' },
    }
];

// Navegación de Rol DOCTOR | ENFERMERO
export const navItemsUsuario: INavData[] = [
    {
        name: 'Panel Administrativo',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' },
        /* badge: {
                color: 'info',
                text: 'NEW',
            }, */
    },
    {
        name: 'MENÚ',
        title: true,
    },
    {
        name: 'Pacientes',
        url: '/pacientes/consultar',
        iconComponent: { name: 'cil-notes' },
    },
    {
        name: 'Tamizaje',
        url: '/tamizaje/consultar',
        iconComponent: { name: 'cil-puzzle' },
    },
    {
        name: 'Configuracion',
        url: '/configuracion',
        iconComponent: { name: 'cil-settings' },
    }
];
