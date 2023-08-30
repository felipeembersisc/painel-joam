import { lazy } from 'react';

// project imports
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import AuthGuard from '@/utils/route-guard/AuthGuard';

// GERAL
const Fornecedores = Loadable(lazy(() => import('../views/geral/fornecedores')));

// FINANCEIRO
const CadastroEmpresas = Loadable(lazy(() => import('../views/financeiro/empresas')));
const CadastroBancos = Loadable(lazy(() => import('../views/financeiro/bancos')));
const CadastroContasBancarias = Loadable(lazy(() => import('../views/financeiro/contasBancarias')));
const MovimentoFinanceiro = Loadable(lazy(() => import('../views/financeiro/movimentoFinanceiro')));
const CategoriasMovimento = Loadable(lazy(() => import('../views/financeiro/categoriasMovimento')));

// ==============================|| FINANCEIRO ROTAS ||============================== //

export const RotasFinanceiro = {
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
         path: '/financeiro',
         children: [
            {
               path: 'cadastro-empresas',
               element: <CadastroEmpresas />
            },
            {
               path: 'cadastro-bancos',
               element: <CadastroBancos />
            },
            {
               path: 'cadastro-contas-bancarias',
               element: <CadastroContasBancarias />
            },
            {
               path: 'cadastro-categorias-movimento',
               element: <CategoriasMovimento />
            },
            {
               path: 'movimento-financeiro',
               element: <MovimentoFinanceiro />
            },
         ]
      },
   ]
};
