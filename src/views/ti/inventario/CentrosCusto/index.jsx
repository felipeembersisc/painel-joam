import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddCentroDeCusto from './AddCentroDeCusto';
import FiltroCentroDeCusto from './FiltroCentroDeCusto';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarCentrosCusto } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";

// ==============================|| CENTROS DE CUSTO ||============================== //

const CentrosCusto = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [centrosCusto, setCentrosCusto] = useState([]);
   const [centroCustoSelecionado, setCentroCustoSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getCentrosCusto = async(user, filtro) => {
      const result = await buscarCentrosCusto(user, filtro);
      setCentrosCusto(result);
   }

   const handleEdit = async(data) => {
      setCentroCustoSelecionado(data);
      setOpenDrawer(!openDrawer);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getCentrosCusto(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getCentrosCusto(user);
      handleLoad(false);
   }

   async function getCentroCustoCloseDrawer(){
      handleLoad(true);
      await getCentrosCusto(user, filtro);
      setOpenDrawer(!openDrawer);
      setCentroCustoSelecionado(null);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         await getCentrosCusto(user);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.cdc_id, grow: 0 },
         { name: 'Nome', selector: row => row.cdc_nome },
         { name: 'Status', selector: row => row.cdc_ativo, grow: 2 },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         centrosCusto &&
         centrosCusto.map((x) => ({
            cdc_id: x.cdc_id,
            cdc_nome: x.cdc_nome,
            cdc_ativo: (
               <Chip
                  label={x.cdc_ativo ? 'Ativo' : 'Desativado'}
                  size="medium"
                  sx={{ 
                     color: x.cdc_ativo ? 'success.main' : 'error.main',
                     fontWeight: 'medium'
                  }}
               />
            ),
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Editar">
                     <IconButton color="primary" aria-label="editar" size="large" onClick={()=> handleEdit(x)}>
                        <EditIcon sx={{ fontSize: '1.1rem' }} />
                     </IconButton>
                  </Tooltip>
               </Stack>
            )
      }))
   };

    return (
        <>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
               <Tooltip title="Adicionar Centro de Custo">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpenDrawer(!openDrawer)}
                     endIcon={<AddIcon />}
                  >
                     NOVO
                  </Button>
               </Tooltip>
               <Tooltip title="Filtrar">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpenDrawerFiltro(!openDrawerFiltro)}
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

            <AddCentroDeCusto open={openDrawer} handleDrawerOpen={setOpenDrawer} centroCustoSelecionado={centroCustoSelecionado} getCentroCustoCloseDrawer={getCentroCustoCloseDrawer}/>
            <FiltroCentroDeCusto open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} />
        </>
    );
};

export default CentrosCusto;
