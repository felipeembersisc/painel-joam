import { useState, useEffect } from 'react';

// material-ui
import { Button, IconButton, Stack, Tooltip } from '@mui/material';

// assets
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Services
import { buscarTransferenciasAtivos, buscarCentrosCustoSelect, buscarEscritorios, buscarFuncionarios } from '../../../../services/inventario';

// Utils
import funcoes from '../../../../utils/funcoes';
import moment from 'moment/moment';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import NovaTransferencia from './NovaTransferencia';
import DetalhesTransferencia from './DetalhesTransferencia';
import FiltroTransferencia from './FiltroTransferencia';

// ==============================|| TRANSFERENCIA DE ATIVOS ||============================== //

const TransferirAtivos = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

    const [transferenciasAtivos, setTransferenciasAtivos] = useState([]);
    const [centrosCusto, setCentrosCusto] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [escritorios, setEscritorios] = useState([]);
    const [transferenciaSelecionada, setTransferenciaSelecionada] = useState(null);
    const [filtro, setFiltro] = useState(null);

    // Modal
    const [openNovaTransferencia, setOpenNovaTransferencia] = useState(false);
    const [openDestalhes, setOpenDetalhes] = useState(false);

   //  Drawer
    const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

    const getTransferenciasAtivos = async(user, filtro) => {
      const result = await buscarTransferenciasAtivos(user, filtro);
      setTransferenciasAtivos(result);
    }

    const getCentrosCusto = async() =>{
      const result = await buscarCentrosCustoSelect(user);
      setCentrosCusto(result);
    }

    const getFuncionarios = async() => {
      const result = await buscarFuncionarios(user);
      setFuncionarios(result);
    }

    const getEscritorios = async() =>{
      const result = await buscarEscritorios(user);
      setEscritorios(result);
    }

   const handleEdit = async(type, data) => {
      handleLoad(true);
      switch(type){
         case 'detalhes':
            setOpenDetalhes(true);
            setTransferenciaSelecionada(data);
         break;
      }
      handleLoad(false);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getTransferenciasAtivos(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getTransferenciasAtivos(user);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         handleLoad(true);
         await getFuncionarios();
         await getEscritorios();
         await getCentrosCusto();
         await getTransferenciasAtivos(user);
         handleLoad(false);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.doc_id, grow: 0 },
         { name: 'Escritório', selector: row => row.doc_escritorio_nome },
         { name: 'Centro de Custo', selector: row => row.doc_centrocusto_nome },
         { name: 'Responsável', selector: row => row.doc_responsavel_nome },
         { name: 'Tranferido em', selector: row => row.doc_data_termo },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         transferenciasAtivos &&
         transferenciasAtivos.map((x) => ({
            doc_id: x.doc_id,
            doc_escritorio_nome: x.escritorio_destino ? funcoes.camelCase(x.escritorio_destino.esc_nome) : ( x.escritorio_origem ? funcoes.camelCase(x.escritorio_origem.esc_nome) : 'Sem Escritório' ),
            doc_centrocusto_nome: x.centro_custo_destino ? funcoes.camelCase(x.centro_custo_destino.cdc_nome) : 'Sem Centro de Custo',
            doc_responsavel_nome: x.funcionario_responsavel ? funcoes.camelCase(x.funcionario_responsavel.fun_nome) : 'Sem Responsável',
            doc_data_termo: moment(x.doc_gerado_em).format('DD/MM/YYYY'),
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Ver Detalhes">
                     <IconButton color="primary" aria-label="ver-ativos" size="large" onClick={()=> handleEdit('detalhes', x)}>
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
            <Tooltip title="Transferir Ativo">
               <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={()=> setOpenNovaTransferencia(true)}
                  endIcon={<PlaylistAddIcon />}
               >
                  NOVA TRANFERÊNCIA
               </Button>
            </Tooltip>
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

         <DetalhesTransferencia open={openDestalhes} setOpen={setOpenDetalhes} transferencia={transferenciaSelecionada} escritorios={escritorios} funcionarios={funcionarios} centrosCusto={centrosCusto}/>
         <NovaTransferencia open={openNovaTransferencia} setOpen={setOpenNovaTransferencia} funcionarios={funcionarios} escritorios={escritorios} getTransferenciasAtivos={getTransferenciasAtivos} centrosCusto={centrosCusto}/>
         <FiltroTransferencia open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} funcionarios={funcionarios} escritorios={escritorios}/>
      </>
   );
};

export default TransferirAtivos;
