import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import AuthGuard from '@/utils/route-guard/AuthGuard';

// GERAL
const Fornecedores = Loadable(lazy(() => import('../views/geral/fornecedores')));

// TI - INVENTARIO
const DashBoardAtivos = Loadable(lazy(() => import('../views/ti/inventario/dashboard')));
const Ativos = Loadable(lazy(() => import('../views/ti/inventario/ativos')));
const TransferirAtivos = Loadable(lazy(() => import('../views/ti/inventario/transferirAtivos')));
const DocumentosEntrada = Loadable(lazy(() => import('../views/ti/inventario/documentosEntrada')));
const CentrosCusto = Loadable(lazy(() => import('../views/ti/inventario/centrosCusto')));
const AtivosEscritorio = Loadable(lazy(() => import('../views/ti/inventario/ativosEscritorio')));

// ==============================|| INVENTARIO ROTAS ||============================== //

export const RotasInventario = {
   path: '/',
   element: (
      <AuthGuard>
         <MainLayout />
      </AuthGuard>
   ),
   children: [
      {
         path: '/geral',
         children: [
            {
               path: 'cadastro-fornecedores',
               element: <Fornecedores />
            }
         ]
      },
      {
         path: '/ti/inventario',
         children: [
            {
               path: 'dashboard',
               element: <DashBoardAtivos />
            },
            {
               path: 'cadastro-ativos',
               element: <Ativos />
            },
            {
               path: 'relatorio-ativos',
               element: <AtivosEscritorio />
            },
            {
               path: 'transferir-ativos',
               element: <TransferirAtivos />
            },
            {
               path: 'documentos-entrada',
               element: <DocumentosEntrada />
            },
            {
               path: 'centros-de-custo',
               element: <CentrosCusto />
            },
         ]
      }
   ]
};
