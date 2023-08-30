// assets
import { IconBox, IconBrandWindows } from '@tabler/icons';

// ==============================|| INVENTARIO MENU ITEMS ||============================== //

export const menuInventario = [
   {
       id: 'ti',
       title: 'TI',
       icon: IconBrandWindows,
       type: 'group',
       children: [
         {
            id: 'inventario',
            title: 'Inventário',
            type: 'collapse',
            icon: IconBox,
            children: [
               {
                  id: 'dashboardAtivos',
                  title: 'Dashboard',
                  type: 'item',
                  url: '/ti/inventario/dashboard'
               },
               {
                  id: 'ativos',
                  title: 'Cadastro de Ativos',
                  type: 'item',
                  url: '/ti/inventario/cadastro-ativos'
               },
               {
                  id: 'relatorio-ativos',
                  title: 'Relatório de Ativos',
                  type: 'item',
                  url: '/ti/inventario/relatorio-ativos'
               },
               {
                  id: 'transferir-ativos',
                  title: 'Transferência de Ativos',
                  type: 'item',
                  url: '/ti/inventario/transferir-ativos'
               },
               {
                  id: 'documentos-entrada',
                  title: 'Documentos de Entrada',
                  type: 'item',
                  url: '/ti/inventario/documentos-entrada'
               },
               {
                  id: 'cadastro-fornecedores',
                  title: 'Cadastro de Fornecedores',
                  type: 'item',
                  url: '/ti/inventario/cadastro-fornecedores'
               },
               {
                  id: 'centro-de-custo',
                  title: 'Centros de Custo',
                  type: 'item',
                  url: '/ti/inventario/centros-de-custo'
               },
            ]
         }
     ]
   }
]
