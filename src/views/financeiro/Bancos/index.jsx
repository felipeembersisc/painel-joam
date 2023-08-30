import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddBanco from './AddBanco';
import FiltroBanco from './FiltroBanco';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarBancos } from '../../../services/financeiro';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../components/DataTable";
import funcoes from '../../../utils/funcoes';

// ==============================|| BANCOS ||============================== //

const Bancos = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [bancos, setBancos] = useState([]);
   const [bancoSelecionado, setBancoSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getBancos = async(user, filtro) => {
      const result = await buscarBancos(user, filtro);
      setBancos(result);
   }

   const handleEdit = async(data) => {
      setBancoSelecionado(data);
      setOpenDrawer(!openDrawer);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getBancos(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getBancos(user);
      handleLoad(false);
   }

   async function handleCloseDrawerAdd(){
      await getBancos(user, filtro);
      setOpenDrawer(false);
      setBancoSelecionado(null);
   }

   useEffect(()=> {
      async function initComponent(){
         await getBancos(user);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.ban_id, grow: 0 },
         { name: 'Nome', selector: row => row.ban_nome, grow: 2 },
         { name: 'Código', selector: row => row.ban_codigo, grow: 1 },
         { name: 'Status', selector: row => row.ban_is_ativo, grow: 1 },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         bancos &&
         bancos.map((x) => ({
            ban_id: x.ban_id,
            ban_nome: x.ban_nome ? funcoes.camelCase(x.ban_nome) : 'Sem Nome!',
            ban_codigo: x.ban_codigo ? x.ban_codigo : 'Sem Código!',
            ban_is_ativo: (
               <Chip
                  label={x.ban_is_ativo ? 'Ativa' : 'Desativada'}
                  size="medium"
                  sx={{ 
                     color: x.ban_is_ativo ? 'success.main' : 'error.main',
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
            <Tooltip title="Cadastrar Banco">
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

         <AddBanco open={openDrawer} bancoSelecionado={bancoSelecionado} handleCloseDrawer={handleCloseDrawerAdd}/>
         <FiltroBanco open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} />
      </>
   );
};

export default Bancos;
