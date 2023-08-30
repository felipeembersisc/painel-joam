import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';

// project import
import AddContaBancaria from './AddContaBancaria';
import FiltroContaBancaria from './FiltroContaBancaria';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';

// Services
import { buscarBancosSelect, buscarContasBancarias, buscarEmpresasSelect } from '../../../services/financeiro';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../components/DataTable";
import funcoes from '../../../utils/funcoes';
import moment from 'moment';
import ModalSelectEmpresa from '../../../components/ModalSelectEmpresa';
import { toast } from 'react-toastify';

// ==============================|| CONTAS BANCARIAS ||============================== //

const ContasBancarias = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [contasBancarias, setContasBancarias] = useState([]);
   const [contaSelecionada, setContaSelecionada] = useState(null);
   const [bancos, setBancos] = useState([]);
   const [empresas, setEmpresas] = useState([]);
   const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
   const [filtro, setFiltro] = useState(null);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   // Modal
   const [openModalSelect, setOpenModalSelect] = useState(false);

   const getContas = async(filtro, empresaId) => {
      const result = await buscarContasBancarias(user, filtro, empresaId ?? empresaSelecionada?.id);
      setContasBancarias(result);
   }
   
   function handleActions(action, value){
      switch (action) {
         case 'cadastro':
            if(bancos.length <= 0) return toast.info('Nenhum banco cadastrado, favor cadastrar!');

            setOpenDrawer(!openDrawer);
         break;
         case 'editar':
            if(bancos.length <= 0) return toast.info('Nenhum banco cadastrado, favor cadastrar!');

            setContaSelecionada(value);
            setOpenDrawer(!openDrawer);
         break;
         case 'filtro':
            if(bancos.length <= 0) return toast.info('Nenhum banco cadastrado, favor cadastrar!');

            setOpenDrawerFiltro(!openDrawerFiltro);
         break;
      
         default:
         break;
      }
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getContas(data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getContas();
      handleLoad(false);
   }

   async function handleCloseDrawerAdd(){
      await getContas(filtro);
      setOpenDrawer(false);
      setContaSelecionada(null);
   }

   async function getEmpresas(){
      const result = await buscarEmpresasSelect(user);
      setEmpresas(result);

      setOpenModalSelect(true);
   }

   async function getBancos(){
      const result = await buscarBancosSelect(user);
      setBancos(result);
   }

   async function handleSelectEmpresa(empresa){
      handleLoad(true);
      setEmpresaSelecionada(empresa);
      await getContas(null, empresa.id);
      setOpenModalSelect(false);
      handleLoad(false);
   }

   function handleChangeEmpresa(){
      setOpenModalSelect(true);
   }

   useEffect(()=> {
      async function initComponent(){
         await getEmpresas();
         await getBancos();
      }

      initComponent();
   }, []);

   const datatable = {
      columns: [
         { name: '#', selector: row => row.con_id, grow: 0 },
         { name: 'Nome', selector: row => row.con_nome },
         { name: 'Banco', selector: row => row.con_banco },
         { name: 'Criado por', selector: row => row.con_criado_por },
         { name: 'Criado em', selector: row => row.con_criado_em },
         { name: 'Status', selector: row => row.con_is_ativo },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         contasBancarias &&
         contasBancarias.map((x) => ({
            con_id: x.con_id,
            con_nome: x.con_nome ? funcoes.camelCase(x.con_nome) : 'Sem Nome!',
            con_banco: x.banco ? funcoes.camelCase(x.banco.ban_nome) : 'Sem Nome!',
            con_criado_por: x.usuario ? x.usuario.usu_nome : 'NÃO ENCONTRADO!',
            con_criado_em: x.con_criado_em ? moment(x.con_criado_em).format('DD/MM/YYYY') : 'NÃO ENCONTRADO!',
            con_is_ativo: (
               <Chip
                  label={x.con_is_ativo ? 'Ativa' : 'Desativada'}
                  size="medium"
                  sx={{ 
                     color: x.con_is_ativo ? 'success.main' : 'error.main',
                     fontWeight: 'medium'
                  }}
               />
            ),
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Editar">
                     <IconButton color="primary" aria-label="editar" size="large" onClick={()=> handleActions('editar', x)}>
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
            <Tooltip title="Cadastrar Conta">
               <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={()=> handleActions('cadastro')}
                  endIcon={<AddIcon />}
               >
                  CADASTRAR
               </Button>
            </Tooltip>
            <Tooltip title="Filtrar">
               <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={()=> handleActions('filtro')}
                  endIcon={<SearchIcon />}
               >
                  FILTRAR
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
            {
               empresaSelecionada &&
               <Typography fontWeight={500} fontSize={16}>
                  Empresa: {funcoes.camelCase(empresaSelecionada.label)} 
                  <Typography variant='button' onClick={handleChangeEmpresa} fontSize={16} sx={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '15px', color: '#FF0000' }}>
                     Alterar Aqui!
                  </Typography>
               </Typography>
            }
         </Stack>
         <DateTable
            linhas={datatable.rows || []}
            colunas={datatable.columns || []}
         />

         <AddContaBancaria open={openDrawer} contaSelecionada={contaSelecionada} empresaSelecionada={empresaSelecionada} bancos={bancos} handleCloseDrawer={handleCloseDrawerAdd}/>
         <FiltroContaBancaria open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} empresaSelecionada={empresaSelecionada} bancos={bancos} filtro={filtro} handleFiltro={handleFilter} />
         <ModalSelectEmpresa open={openModalSelect} setOpen={setOpenModalSelect} empresas={empresas} acao={handleSelectEmpresa} />
      </>
   );
};

export default ContasBancarias;
