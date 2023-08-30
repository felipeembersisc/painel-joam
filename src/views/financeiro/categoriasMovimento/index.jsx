import { useState, useEffect } from 'react';

// material-ui
import { Button, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddCategoria from './AddCategoria';
import FiltroCategoria from './FiltroCategoria';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarCategoriasMovimento } from '../../../services/financeiro';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../components/DataTable";
import funcoes from '../../../utils/funcoes';

// ==============================|| CATEGORIAS MOVIMENTO ||============================== //

const CategoriasMovimento = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [categorias, setCategorias] = useState([]);
   const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getCategorias = async(user, filtro) => {
      const result = await buscarCategoriasMovimento(user, filtro);
      setCategorias(result);
   }

   const handleEdit = async(data) => {
      setCategoriaSelecionada(data);
      setOpenDrawer(!openDrawer);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getCategorias(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getCategorias(user);
      handleLoad(false);
   }

   async function handleCloseDrawerAdd(){
      await getCategorias(user, filtro);
      setOpenDrawer(false);
      setCategoriaSelecionada(null);
   }

   useEffect(()=> {
      async function initComponent(){
         await getCategorias(user);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.ctm_id, grow: 0 },
         { name: 'Nome', selector: row => row.ctm_nome },
         { name: 'Descrição', selector: row => row.ctm_descricao },
         { name: 'Ação', selector: row => row.acao, grow: 0 }
      ],
      rows: 
         categorias &&
         categorias.map((x) => ({
            ctm_id: x.ctm_id,
            ctm_nome: x.ctm_nome ? funcoes.camelCase(x.ctm_nome) : 'Sem Nome!',
            ctm_descricao: x.ctm_descricao ? funcoes.camelCase(x.ctm_descricao) : 'Sem Descrição!',
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
            <Tooltip title="Cadastrar Categoria">
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

         <AddCategoria open={openDrawer} categoriaSelecionada={categoriaSelecionada} handleCloseDrawer={handleCloseDrawerAdd}/>
         <FiltroCategoria open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} />
      </>
   );
};

export default CategoriasMovimento;
