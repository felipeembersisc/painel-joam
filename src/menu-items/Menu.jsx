// assets
import { IconHome, IconBrandWindows, IconArticle, IconPlus, IconReportMedical, IconClipboardList, IconClipboardCheck, IconRobot, IconFileUpload, IconFileDownload, IconReportAnalytics } from '@tabler/icons';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

export const menu = [
   {
      id: 'menu',
      title: 'CRM - Menu',
      icon: IconBrandWindows,
      type: 'group',
      children: [
         {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            icon: IconHome,
            url: '/dashboard'
         },
         {
            id: 'auditoria',
            title: 'Auditória',
            type: 'collapse',
            icon: IconArticle,
            children: [
               {
                  id: 'prospect',
                  title: 'Prospect',
                  type: 'item',
                  url: '/auditoria/prospect'
               }
            ]
         },
         {
            id: 'cadastro',
            title: 'Cadastros',
            type: 'collapse',
            icon: IconPlus,
            children: [
               {
                  id: 'blacklist',
                  title: 'Blacklist',
                  type: 'item',
                  url: '/cadastro/blacklist'
               },
               {
                  id: 'cnae',
                  title: 'Cnae',
                  type: 'item',
                  url: '/cadastro/cnae'
               },
               {
                  id: 'configuracaoMailing',
                  title: 'Configuração Mailing',
                  type: 'item',
                  url: '/cadastro/configuracao-mailing'
               },
               {
                  id: 'convenio',
                  title: 'Convênio',
                  type: 'item',
                  url: '/cadastro/convenio'
               },
               {
                  id: 'empresa',
                  title: 'Empresa',
                  type: 'item',
                  url: '/cadastro/empresa'
               },
               {
                  id: 'mensagem',
                  title: 'Mensagem',
                  type: 'item',
                  url: '/cadastro/mensagem'
               },
               {
                  id: 'origem',
                  title: 'Origem',
                  type: 'item',
                  url: '/cadastro/origem'
               },
               {
                  id: 'segmentoCnae',
                  title: 'Segmento Cnae',
                  type: 'item',
                  url: '/cadastro/segmento-cnae'
               },
               {
                  id: 'tabulacoes',
                  title: 'Tabulações',
                  type: 'collapse',
                  icon: IconReportMedical,
                  children: [
                     {
                        id: 'j4Santander',
                        title: 'J4 Santander',
                        type: 'item',
                        url: '/tabulacao/j4'
                     },
                     {
                        id: 'mailingProspect',
                        title: 'Mailing Prospect',
                        type: 'item',
                        url: '/tabulacao/prospect'
                     },
                  ]
               },
               {
                  id: 'usuario',
                  title: 'Usuário',
                  type: 'item',
                  url: '/cadastro/usuario'
               },
               {
                  id: 'vincularConvenioEmpresa',
                  title: 'Vincular Convênio x Empresa',
                  type: 'item',
                  url: '/cadastro/convenio-empresa'
               },
            ]
         },
         {
            id: 'solicitacao',
            title: 'Solicitação',
            type: 'collapse',
            icon: IconClipboardList,
            children: [
               {
                  id: 'listar',
                  title: 'Listar',
                  type: 'item',
                  url: '/solicitacao'
               },
               {
                  id: 'prazoExtra',
                  title: 'Prazo Extra',
                  type: 'item',
                  url: '/solicitacao/prazo'
               },
               {
                  id: 'sms',
                  title: 'Sms',
                  type: 'item',
                  url: '/solicitacao/sms'
               }
            ]
         },
         {
            id: 'mailing',
            title: 'Mailing',
            type: 'collapse',
            icon: IconClipboardCheck,
            children: [
               {
                  id: 'listar',
                  title: 'Listar',
                  type: 'item',
                  url: '/mailing'
               },
               {
                  id: 'prospect',
                  title: 'Prospect',
                  type: 'item',
                  url: '/mailing/Prospect'
               }
            ]
         },
         {
            id: 'robos',
            title: 'Robos',
            type: 'collapse',
            icon: IconRobot,
            children: [
               {
                  id: 'margem',
                  title: 'Margem',
                  type: 'collapse',
                  children: [
                     {
                        id: 'filaProcessamento',
                        title: 'Fila Processamento',
                        type: 'item',
                        url: '/robo/margem/fila'
                     },
                     {
                        id: 'regras',
                        title: 'Regras',
                        type: 'item',
                        url: '/robo/margem/regras'
                     },
                     {
                        id: 'processados',
                        title: 'Processados',
                        type: 'item',
                        url: '/robo/margem/processados'
                     },
                  ]
               },
               {
                  id: 'unificado',
                  title: 'Unificado',
                  type: 'collapse',
                  children: [
                     {
                        id: 'filaProcessamento',
                        title: 'Fila Processamento',
                        type: 'item',
                        url: '/robo/unificado/fila'
                     },
                     {
                        id: 'regras',
                        title: 'Regras',
                        type: 'item',
                        url: '/robo/unificado/regras'
                     },
                     {
                        id: 'processados',
                        title: 'Processados',
                        type: 'item',
                        url: '/robo/unificado/processados'
                     },
                  ]
               },
               {
                  id: 'veiculos',
                  title: 'Veículos',
                  type: 'collapse',
                  children: [
                     {
                        id: 'filaProcessamento',
                        title: 'Fila Processamento',
                        type: 'item',
                        url: '/robo/veiculo/fila'
                     },
                     {
                        id: 'regras',
                        title: 'Regras',
                        type: 'item',
                        url: '/robo/veiculo/regras'
                     },
                     {
                        id: 'processados',
                        title: 'Processados',
                        type: 'item',
                        url: '/robo/veiculo/processados'
                     },
                  ]
               },
            ]
         },
         {
            id: 'importacoes',
            title: 'Importações',
            type: 'collapse',
            icon: IconFileUpload,
            children: [
               {
                  id: 'carteira',
                  title: 'Carteira',
                  type: 'item',
                  url: '/importacao/carteira'
               },
               {
                  id: 'cnpjRais',
                  title: 'Cnpj Rais',
                  type: 'item',
                  url: '/importacao/cnpj-rais'
               },
               {
                  id: 'higienizadorCpf',
                  title: 'Higienizador CPF',
                  type: 'item',
                  url: '/importacao/higienizador-cpf'
               },
               {
                  id: 'j4',
                  title: 'J4',
                  type: 'item',
                  url: '/importacao/j4'
               },
               {
                  id: 'prioridadeProcessamento',
                  title: 'Prioridade Processamento',
                  type: 'item',
                  url: '/importacao/prioridade-processamento'
               },
            ]
         },
         {
            id: 'exportacoes',
            title: 'Exportações',
            type: 'collapse',
            icon: IconFileDownload,
            children: [
               {
                  id: 'discadora',
                  title: 'Discadora',
                  type: 'item',
                  url: '/exportacao/discadora'
               },
               {
                  id: 'escobs',
                  title: 'Escobs',
                  type: 'item',
                  url: '/exportacao/escobs'
               },
               {
                  id: 'fgts',
                  title: 'Fgts',
                  type: 'item',
                  url: '/exportacao/fgts'
               },
               {
                  id: 'unificado',
                  title: 'Unificado',
                  type: 'item',
                  url: '/exportacao/unificado'
               },
            ]
         },
         {
            id: 'relatorios',
            title: 'Relatórios',
            type: 'collapse',
            icon: IconReportAnalytics,
            children: [
               {
                  id: 'tabulacaoMailingProspect',
                  title: 'Tabulação Mailing Prospect',
                  type: 'item',
                  url: '/relatorios/tabulacao-prospect'
               }
            ]
         },
      ]
   }
]