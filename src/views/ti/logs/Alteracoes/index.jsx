import { useState, useEffect } from 'react';

// material-ui
import { Button, IconButton, Stack, Tooltip } from '@mui/material';

// assets
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Services
import { buscarFuncionarios } from '../../../../services/inventario';

// Utils
import moment from 'moment/moment';
import funcoes from '../../../../utils/funcoes';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import DetalhesLog from './DetalhesLog';
import FiltroLog from './FiltroLog';
import { buscarLogsAlteracoes } from '../../../../services/logs';

// ==============================|| LOGS DE ALTERAÇÕES ||============================== //

const LogsAlteracoes = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [logsAlteracoes, setLogsAlteracoes] = useState([]);
   const [funcionarios, setFuncionarios] = useState([]);
   const [logAlteracaoSelecionada, setLogAlteracaoSelecionada] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // Modal
   const [openDestalhes, setOpenDetalhes] = useState(false);

   //  Drawer
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getLogsAlteracoes = async(user, filtro) => {
      const result = await buscarLogsAlteracoes(user, filtro);
      setLogsAlteracoes(result);
   }

   const getFuncionarios = async() => {
      const result = await buscarFuncionarios(user);
      setFuncionarios(result);
   }

   const handleEdit = async(type, data) => {
      handleLoad(true);
      switch(type){
         case 'detalhes':
            setOpenDetalhes(true);
            setLogAlteracaoSelecionada(data);
         break;
      }
      handleLoad(false);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getLogsAlteracoes(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getLogsAlteracoes(user);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         handleLoad(true);
         await getFuncionarios();
         await getLogsAlteracoes(user);
         handleLoad(false);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.log_id, grow: 0, sortable: true},
         { name: 'Ação Feita', selector: row => row.log_acao, sortable: true },
         { name: 'Tabela', selector: row => row.log_tabela, sortable: true },
         { name: 'Gerado por', selector: row => row.log_criado_por, sortable: true },
         { name: 'Gerado em', selector: row => row.log_criado_em, sortable: true },
         { name: 'Log resumido', selector: row => row.log_resumido, grow: 2 },
         { name: 'Ação', selector: row => row.acao, grow: 0 }
      ],
      rows:
         logsAlteracoes &&
         logsAlteracoes.map((x) => ({
            log_id: x.log_id,
            log_acao: x.log_acao ? funcoes.camelCase(x.log_acao) : '-',
            log_tabela: x.log_tabela,
            log_criado_por: x.usuario_criou ? x.usuario_criou?.usu_nome : '-',
            log_criado_em: moment(x.log_criado_em).format('DD/MM/YYYY'),
            log_resumido: x.log_dados ? funcoes.limitarTexto(JSON.stringify(x.log_dados), 60) : '-',
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Ver Detalhes">
                     <IconButton color="primary" aria-label="ver-detalhes" size="large" onClick={()=> handleEdit('detalhes', x)}>
                        <AssignmentIcon sx={{ fontSize: '1.2rem' }} />
                     </IconButton>
                  </Tooltip>
               </Stack>
            )
      }))
   };

   return (
      <>
         <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
            <Tooltip title="Filtrar">
               <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={setOpenDrawerFiltro}
                  endIcon={<SearchIcon />}
               >
                  FILTRO
               </Button>
            </Tooltip>
            {
               filtro &&
               <Tooltip title="Limpar Filtro">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={handleClearFilter}
                     endIcon={<ClearIcon />}
                  >
                     LIMPAR FILTRO
                  </Button>
               </Tooltip>
            }
         </Stack>

         <DateTable
            linhas={datatable.rows || []}
            colunas={datatable.columns || []}
         />

         <DetalhesLog open={openDestalhes} setOpen={setOpenDetalhes} logAlteracao={logAlteracaoSelecionada} funcionarios={funcionarios}/>
         <FiltroLog open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} funcionarios={funcionarios} />
      </>
   );
};

export default LogsAlteracoes;
