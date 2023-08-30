import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid, Link, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TuneIcon from '@mui/icons-material/Tune';

// Services
import { buscarHistoricoQuantidadeAtivo, buscarTransferenciasAtivo } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';
import { DateTable } from '../../../../components/DataTable';

// Utils
import moment from 'moment';
import funcoes from '../../../../utils/funcoes';

// tabs option
const tabsOption = [
   {
       label: 'Transferências',
       icon: <SwapHorizIcon sx={{ fontSize: '1.3rem' }} />
   },
   {
       label: 'Alteração de Qtd.',
       icon: <TuneIcon sx={{ fontSize: '1.3rem' }} />
   }
];

// ==============================|| HISTÓRICO DOS ATIVOS ||============================== //

const HistoricoAtivo = ({ open, setOpen, ativoSelecionado }) => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [historicoTransferencias, setHistoricoTransferencias] = useState(null);
   const [historicoQuantidades, setHistoricoQuantidades] = useState(null);

   const [valueTab, setValueTab] = useState(0);

   const handleChangeTab = (event, newValue) => {
      setValueTab(newValue);
   };

   // tabs panel
   function TabPanel({ children, value, index, ...other }) {
      return (
         <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
         </div>
      );
   }

   function a11yProps(index) {
      return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`
      };
   }

   useEffect(()=> {
      async function buscarAtivos(){
         handleLoad(true);
         const resultHistoricoTransferencias = await buscarTransferenciasAtivo(user, ativoSelecionado?.ati_id);
         setHistoricoTransferencias(resultHistoricoTransferencias);


         const resultHistoricoQuantidades = await buscarHistoricoQuantidadeAtivo(user, ativoSelecionado?.ati_id);
         setHistoricoQuantidades(resultHistoricoQuantidades);

         handleLoad(false);
      }

      if(ativoSelecionado?.ati_id && open){
         buscarAtivos();
      }
   }, [open])

   const datatableTransferencias = {
      columns: [
         { name: 'Ação', selector: row => row.acao, sortable: true },
         { name: 'ID', selector: row => row.ite_documento_id, grow: 0, sortable: true },
         { name: 'Origem', selector: row => row.origem, grow: 2, sortable: true },
         { name: 'Destino', selector: row => row.destino, grow: 2, sortable: true },
         { name: 'Centro de Custo', selector: row => row.centroCusto, grow: 2, sortable: true },
         { name: 'Qtd', selector: row => row.qtd, grow: 0, sortable: true },
         { name: 'Data', selector: row => row.data, grow: 1, sortable: true },
      ],
      rows: 
         historicoTransferencias &&
         historicoTransferencias.map((x) => ({
            acao: <Typography fontWeight={500}>{x?.documento?.doc_fornecedor_id ? 'Entrada de Nota' : 'Transferência'}</Typography>,
            ite_documento_id: x?.ite_documento_id,
            origem: x?.documento?.funcionario_origem ? funcoes.camelCase(x.documento.funcionario_origem.fun_nome) : ( x.documento?.escritorio_origem ? funcoes.camelCase(x.documento.escritorio_origem.esc_nome) : funcoes.camelCase(x.documento?.fornecedor.for_nome)),
            destino: x?.documento?.funcionario_destino ? funcoes.camelCase(x.documento.funcionario_destino.fun_nome) : funcoes.camelCase(x.documento.escritorio_destino.esc_nome),
            centroCusto: x?.documento?.centro_custo_destino ? funcoes.camelCase(x.documento.centro_custo_destino.cdc_nome) : 'Sem Centro de Custo',
            qtd: <Typography fontWeight={500}>{x?.ite_qtd}</Typography>,
            data: moment(x.documento.doc_gerado_em).format('DD/MM/YYYY'),
      }))
   };

   const datatableHistoricoQtd = {
      columns: [
         { name: 'Escritório', selector: row => row.esc_nome, sortable: true },
         { name: 'Centro de Custo', selector: row => row.cdc_nome, sortable: true },
         { name: 'Qtd. Anterior', selector: row => row.ine_qtd_anterior, sortable: true },
         { name: 'Qtd. Nova', selector: row => row.ine_qtd_nova, sortable: true },
         { name: 'Alterado Por', selector: row => row.usu_nome, sortable: true },
         { name: 'Alterado Em', selector: row => row.haq_alterado_em, sortable: true },
      ],
      rows: 
         historicoQuantidades &&
         historicoQuantidades.map((x) => ({
            esc_nome: x?.inventario?.escritorio?.esc_nome ?? 'Sem escritório',
            cdc_nome: x?.inventario?.centro_de_custo?.cdc_nome ?? 'Sem centro de custo',
            ine_qtd_anterior: x?.haq_objeto_anterior?.ine_qtd ?? 'Sem qtd. anterior',
            ine_qtd_nova: x?.haq_objeto_novo?.ine_qtd ?? 'Sem qtd. anterior',
            usu_nome: x?.usuario ? x.usuario?.usu_nome : 'Sem nome',
            haq_alterado_em: moment(x.haq_alterado_em).format('DD/MM/YYYY'),
      }))
   };

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Histórico do ativo"
         style= {{
            width: { xs: 280, lg: 1280 },
            height: { minHeight: 500 },
            maxHeight: '90vh',
            overflowY: 'auto',
         }}
      >
         <Grid item xs={12}>
            <Tabs
               value={valueTab}
               indicatorColor="secondary"
               textColor="secondary"
               onChange={handleChangeTab}
               // aria-label="simple tabs example"
               variant="scrollable"
               sx={{
                     mb: 3,
                     '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 1,
                        mr: 2.25,
                        color: theme.palette.grey[600],
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                     },
                     '& a.Mui-selected': {
                        color: theme.palette.secondary.main
                     },
                     '& .MuiTabs-indicator': {
                        bottom: 2
                     },
                     '& a > svg': {
                        marginBottom: '0px !important',
                        mr: 1.25
                     }
               }}
            >
               {tabsOption.map((tab, index) => (
                  <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
               ))}
            </Tabs>
            <TabPanel value={valueTab} index={0}>
               <DateTable
                  linhas={datatableTransferencias.rows || []}
                  colunas={datatableTransferencias.columns || []}
                  options={{
                     pagination: false
                  }}
               />
            </TabPanel>
            <TabPanel value={valueTab} index={1}>
               <DateTable
                  linhas={datatableHistoricoQtd.rows || []}
                  colunas={datatableHistoricoQtd.columns || []}
                  options={{
                     pagination: false
                  }}
               />
            </TabPanel>
         </Grid>
      </SimpleModal>
   );
};

export default HistoricoAtivo;
