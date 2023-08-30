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

// TI - LOGS
const LogsErros = Loadable(lazy(() => import('../views/ti/logs/erros')));
const LogsAlteracoes = Loadable(lazy(() => import('../views/ti/logs/alteracoes')));

// TI - ADMINISTAÇÃO
const Usuarios = Loadable(lazy(() => import('../views/ti/administracao/usuarios')));
const GruposUsuarios = Loadable(lazy(() => import('../views/ti/administracao/gruposUsuarios')));

// ==============================|| TI ROTAS ||============================== //

export const RotasTi = {
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
               path: 'cadastro-fornecedores',
               element: <Fornecedores />
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
      },
      {
         path: '/ti/logs',
         children: [
            {
               path: 'erros',
               element: <LogsErros />
            },
            {
               path: 'alteracoes',
               element: <LogsAlteracoes />
            },
         ]
      },
      {
         path: '/ti/administracao',
         children: [
            {
               path: 'usuarios',
               element: <Usuarios />
            },
            {
               path: 'grupos-usuarios',
               element: <GruposUsuarios />
            },
         ]
      }
   ]
};
