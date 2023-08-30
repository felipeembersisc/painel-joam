import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddEmpresa from './AddEmpresa';
import FiltroEmpresa from './FiltroEmpresa';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarEmpresas } from '../../../services/financeiro';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../components/DataTable";
import funcoes from '../../../utils/funcoes';
import moment from 'moment';

// ==============================|| EMPRESAS ||============================== //

const Empresas = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [empresas, setEmpresas] = useState([]);
   const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getEmpresas = async(user, filtro) => {
      const result = await buscarEmpresas(user, filtro);
      setEmpresas(result);
   }

   const handleEdit = async(data) => {
      setEmpresaSelecionada(data);
      setOpenDrawer(!openDrawer);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getEmpresas(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getEmpresas(user);
      handleLoad(false);
   }

   async function handleCloseDrawerAdd(){
      await getEmpresas(user, filtro);
      setOpenDrawer(false);
      setEmpresaSelecionada(null);
   }

   useEffect(()=> {
      async function initComponent(){
         await getEmpresas(user);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.emp_id, grow: 0 },
         { name: 'Nome', selector: row => row.emp_nome },
         { name: 'Descrição', selector: row => row.emp_descricao },
         { name: 'Criado por', selector: row => row.emp_criado_por },
         { name: 'Criado em', selector: row => row.emp_criado_em },
         { name: 'Status', selector: row => row.emp_is_ativo },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         empresas &&
         empresas.map((x) => ({
            emp_id: x.emp_id,
            emp_nome: x.emp_nome ? funcoes.camelCase(x.emp_nome) : 'Sem Nome!',
            emp_descricao: x.emp_descricao ? funcoes.camelCase(funcoes.limitarTexto(x.emp_descricao)) : 'Sem Descrição!',
            emp_criado_por: x.usuario ? x.usuario.usu_nome : 'NÃO ENCONTRADO!',
            emp_criado_em: x.emp_criado_em ? moment(x.emp_criado_em).format('DD/MM/YYYY') : 'NÃO ENCONTRADO!',
            emp_is_ativo: (
               <Chip
                  label={x.emp_is_ativo ? 'Ativa' : 'Desativada'}
                  size="medium"
                  sx={{ 
                     color: x.emp_is_ativo ? 'success.main' : 'error.main',
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
            <Tooltip title="Cadastrar Empresa">
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

         <AddEmpresa open={openDrawer} empresaSelecionada={empresaSelecionada} handleCloseDrawer={handleCloseDrawerAdd}/>
         <FiltroEmpresa open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} />
      </>
   );
};

export default Empresas;
