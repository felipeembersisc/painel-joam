import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import AuthGuard from '@/utils/route-guard/AuthGuard';

// TI - INVENTARIO
const DashBoard = Loadable(lazy(() => import('../views/dashboard')));

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
         children: [
            {
               path: 'dashboard',
               element: <DashBoard />
            },
         ]
      }
   ]
};
