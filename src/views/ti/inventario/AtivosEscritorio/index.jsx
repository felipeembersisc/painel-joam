import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, Stack, Tooltip } from '@mui/material';

// assets
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Services
import { buscarAtivosInventario, buscarCentrosCustoSelect, buscarEscritorios, buscarFuncionarios, buscarUrlDocumento, exportarAtivosExcel } from '../../../../services/inventario';

// Utils
import funcoes from '../../../../utils/funcoes';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import FiltroEscritorio from './FiltroEscritorio';

// ==============================|| ATIVOS NO ESCRITORIO ||============================== //

const AtivosEscritorio = () => {
   // Hooks
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [ativos, setAtivos] = useState([]);
   const [escritorios, setEscritorios] = useState([]);
   const [funcionarios, setFuncionarios] = useState([]);
   const [centrosCusto, setCentrosCusto] = useState([]);
   const [filtro, setFiltro] = useState(null);

   //  Drawer
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getAtivos = async(user, filtro) => {
      const result = await buscarAtivosInventario(user, filtro);
      setAtivos(result);
   }

   const getEscritorios = async() =>{
      const result = await buscarEscritorios(user);
      setEscritorios(result);
   }

   const getFuncionarios = async() => {
      const result = await buscarFuncionarios(user);
      setFuncionarios(result);
   }

   const getCentrosCusto = async() =>{
      const result = await buscarCentrosCustoSelect(user);
      setCentrosCusto(result);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getAtivos(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getAtivos(user);
      handleLoad(false);
   }

   async function exportarRelatorio(tipo){
      handleLoad(true);
      switch (tipo) {
         case 'excel':
            await exportarAtivosExcel(user, filtro);
         break;
      
         default:
         break;
      }
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         handleLoad(true);
         await getAtivos(user);
         await getEscritorios();
         await getFuncionarios();
         await getCentrosCusto();
         handleLoad(false);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: 'Patrimônio', selector: row => row.ati_patrimonio, sortable: true },
         { name: 'Tipo', selector: row => row.tipo_ativo, sortable: true },
         { name: 'Fabricante', selector: row => row.fabricante_ativo, sortable: true },
         { name: 'Modelo', selector: row => row.modelo_ativo, sortable: true },
         { name: 'Quantidade', selector: row => row.ine_qtd, sortable: true },
         { name: 'Status', selector: row => row.status_ativo, sortable: true },
         { name: 'Escritório', selector: row => row.escritorio, sortable: true },
         { name: 'Responsável', selector: row => row.responsavel, sortable: true },
         { name: 'Centro de Custo', selector: row => row.centro_de_custo, sortable: true },
      ],
      rows:
         ativos &&
         ativos.map((x) => ({
            ati_patrimonio: !x.ativos.ati_patrimonio ? 'Sem Patrimônio' : x.ativos.ati_patrimonio,
            tipo_ativo: x.ativos.tipo_ativo.tpa_nome,
            fabricante_ativo: x.ativos.fabricante_ativo.fab_nome,
            modelo_ativo: x.ativos.modelo_ativo.mod_nome,
            ine_qtd: x.ine_qtd,
            status_ativo: (
               <Chip
                  label={x.ativos.status_ativo.sta_nome}
                  size="medium"
                  sx={{ 
                     color: x.ativos.ati_status_id == 1 ? 'success.main' : x.ativos.ati_status_id == 2 ? 'warning.main' : x.ativos.ati_status_id == 3 ? 'warning.main' : 'error.main',
                     fontWeight: 'medium'
                  }}
               />
            ),
            escritorio: x.escritorio ? funcoes.camelCase(x.escritorio.esc_nome) : '',
            responsavel: x.funcionario_responsavel ? funcoes.camelCase(x.funcionario_responsavel.fun_nome) : '',
            centro_de_custo: x.centro_de_custo ? funcoes.camelCase(x.centro_de_custo.cdc_nome) : '',
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
            <Tooltip title="Exportar Excel">
               <Button
                  variant="contained"
                  size="small"
                  color="success"
                  sx={{color: '#FFF'}}
                  onClick={()=> exportarRelatorio('excel')}
                  endIcon={<InsertDriveFileIcon />}
               >
                  EXPORTAR
               </Button>
            </Tooltip>
         </Stack>

         <DateTable
            linhas={datatable.rows || []}
            colunas={datatable.columns || []}
         />

         <FiltroEscritorio open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} escritorios={escritorios} funcionarios={funcionarios} centrosCusto={centrosCusto}/>
      </>
   );
};

export default AtivosEscritorio;
