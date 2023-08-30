// assets
import { IconBox, IconBrandWindows, IconArticle, IconSettings, IconCoin, IconTextPlus, IconCash } from '@tabler/icons';

// ==============================|| ADMINISTRAÇÃO MENU ITEMS ||============================== //

export const menuAdm = [
   {
      id: 'geral',
      title: 'Geral',
      icon: IconCoin,
      type: 'group',
      children: [
        {
           id: 'cadastros-gerais',
           title: 'Cadastros',
           type: 'collapse',
           icon: IconTextPlus,
           children: [
               {
                  id: 'cadastro-fornecedores',
                  title: 'Fornecedores',
                  type: 'item',
                  url: '/geral/cadastro-fornecedores'
               }
           ]
        }
     ]
   },
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
                  id: 'relatorio-ativos',
                  title: 'Relatório de Ativos',
                  type: 'item',
                  url: '/ti/inventario/relatorio-ativos'
               },
               {
                  id: 'ativos',
                  title: 'Cadastrar Ativos',
                  type: 'item',
                  url: '/ti/inventario/cadastro-ativos'
               },
               {
                  id: 'transferir-ativos',
                  title: 'Transferir Ativos',
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
   },
   {
      id: 'financeiro',
      title: 'Financeiro',
      icon: IconCoin,
      type: 'group',
      children: [
        {
           id: 'cadastros-inventario',
           title: 'Cadastros',
           type: 'collapse',
           icon: IconTextPlus,
           children: [
              {
                 id: 'cadastro-empresas',
                 title: 'Empresas',
                 type: 'item',
                 url: '/financeiro/cadastro-empresas'
              },
              {
                 id: 'cadastro-bancos',
                 title: 'Bancos',
                 type: 'item',
                 url: '/financeiro/cadastro-bancos'
              },
              {
                 id: 'cadastro-contas-bancarias',
                 title: 'Contas Bancárias',
                 type: 'item',
                 url: '/financeiro/cadastro-contas-bancarias'
              },
              {
                 id: 'cadastro-categorias-movimento',
                 title: 'Categorias Movimento',
                 type: 'item',
                 url: '/financeiro/cadastro-categorias-movimento'
              },
           ]
        },
        {
           id: 'movimento-financeiro',
           title: 'Movimento Financeiro',
           type: 'item',
           url: '/financeiro/movimento-financeiro',
           icon: IconCash,
        }
     ]
   }
]
