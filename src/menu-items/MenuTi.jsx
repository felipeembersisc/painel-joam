// assets
import { IconBox, IconBrandWindows, IconArticle, IconSettings } from '@tabler/icons';

// ==============================|| TI MENU ITEMS ||============================== //

export const menuTi = [
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
         },
         {
            id: 'logs',
            title: 'Logs',
            type: 'collapse',
            icon: IconArticle,
            children: [
               {
                  id: 'logsErros',
                  title: 'Erros',
                  type: 'item',
                  url: '/ti/logs/erros'
               },
               {
                  id: 'logsAlteracoes',
                  title: 'Alterações',
                  type: 'item',
                  url: '/ti/logs/alteracoes'
               },
            ]
         },
         {
            id: 'administracao',
            title: 'Administração',
            type: 'collapse',
            icon: IconSettings,
            children: [
               {
                  id: 'usuarios',
                  title: 'Usuários',
                  type: 'item',
                  url: '/ti/administracao/usuarios'
               },
               {
                  id: 'grupos-usuarios',
                  title: 'Grupos de Usuarios',
                  type: 'item',
                  url: '/ti/administracao/grupos-usuarios'
               },
            ]
         },
      ]
   }
]
