import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import AuthGuard from '@/utils/route-guard/AuthGuard';

// TI - INVENTARIO
const DashBoardAtivos = Loadable(lazy(() => import('../views/ti/inventario/Dashboard')));

// ==============================|| DASHBOARD ROTAS ||============================== //

export const RotasDashboard = {
   path: '/',
   element: (
      <AuthGuard>
         <MainLayout />
      </AuthGuard>
   ),
   children: [
      {
         path: '/ti/inventario',
         children: [
            {
               path: 'dashboard',
               element: <DashBoardAtivos />
            }
         ]
      }
   ]
};
