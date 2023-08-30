// assets
import { IconBox, IconBrandWindows, IconArticle, IconSettings, IconCoin, IconTextPlus, IconCash } from '@tabler/icons';

// ==============================|| FINANCEIRO MENU ITEMS ||============================== //

export const menuFinanceiro = [
   {
      id: 'financeiro',
      title: 'Financeiro',
      icon: IconCoin,
      type: 'group',
      children: [
        {
           id: 'cadastros-financeiro',
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
