import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import AuthGuard from '@/utils/route-guard/AuthGuard';

//pages
const DashBoard = Loadable(lazy(() => import('../views/dashboard')));
const Blacklist = Loadable(lazy(() => import('../views/cadastros/blacklist')));
const Cnae = Loadable(lazy(() => import('../views/cadastros/cnae')));

// ==============================|| DASHBOARD ROTAS ||============================== //

export const Rotas = {
   path: '/',
   element: (
      <AuthGuard>
         <MainLayout />
      </AuthGuard>
   ),
   children: [
      {
         path: '/dashboard',
         element: <DashBoard />
      },
      {
         path: '/cadastro',
         children: [
            {
               path: 'blacklist',
               element: <Blacklist />
            },
            {
               path: 'cnae',
               element: <Cnae />
            }
         ]
      }
   ]
};
