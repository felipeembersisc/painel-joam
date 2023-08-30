import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddFornecedor from './AddFornecedor';
import FiltroFornecedor from './FiltroFornecedor';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarFornecedores } from '../../../services/inventario';

// Utils
import funcoes from '../../../utils/funcoes';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../components/DataTable";
import moment from 'moment';

// ==============================|| FORNECEDORES ||============================== //

const Fornecedores = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [fornecedores, setFornecedores] = useState([]);
   const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   const getFornecedores = async(user, filtro) => {
      const result = await buscarFornecedores(user, filtro);
      setFornecedores(result);
   }

   const handleEdit = async(data) => {
      setFornecedorSelecionado(data);
      setOpenDrawer(!openDrawer);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getFornecedores(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getFornecedores(user);
      handleLoad(false);
   }

   async function getFornecedoresCloseDrawer(){
      handleLoad(true);
      await getFornecedores(user, filtro);
      setOpenDrawer(!openDrawer);
      setFornecedorSelecionado(null);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         await getFornecedores(user);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.for_id, grow: 0 },
         { name: 'Nome', selector: row => row.for_nome },
         { name: 'Razão Social', selector: row => row.for_razao_social },
         { name: 'CNPJ', selector: row => row.for_cpfcnpj },
         { name: 'Criado Em', selector: row => row.for_criado_em },
         { name: 'Status', selector: row => row.for_ativo },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         fornecedores &&
         fornecedores.map((x) => ({
            for_id: x.for_id,
            for_nome: x.for_nome ? funcoes.camelCase(x.for_nome) : 'Sem Nome',
            for_razao_social: x.for_razao_social ? funcoes.camelCase(x.for_razao_social) : 'Sem Razão Social',
            for_cpfcnpj: x.for_cpfcnpj ?? 'CPF ou CNPJ Não Cadastrado',
            for_criado_em: x.for_criado_em ? moment(x.for_criado_em).format('DD/MM/YYYY') : '-',
            for_ativo: (
               <Chip
                  label={x.for_ativo ? 'Ativo' : 'Desativado'}
                  size="medium"
                  sx={{ 
                     color: x.for_ativo ? 'success.main' : 'error.main',
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
               <Tooltip title="Adicionar Fornecedor">
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

            <AddFornecedor open={openDrawer} handleDrawerOpen={setOpenDrawer} fornecedorSelecionado={fornecedorSelecionado} getFornecedoresCloseDrawer={getFornecedoresCloseDrawer}/>
            <FiltroFornecedor open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} />
        </>
    );
};

export default Fornecedores;
