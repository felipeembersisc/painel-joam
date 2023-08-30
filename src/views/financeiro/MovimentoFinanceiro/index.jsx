import { useState, useEffect } from 'react';

// material-ui
import { Avatar, Button, Grid, IconButton, LinearProgress, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';

// project import
import AddMovimentoFinanceiro from './AddMovimentoFinanceiro';
import FiltroMovimentoFinanceiro from './FiltroMovimentoFinanceiro';
import MainCard from '@/ui-component/cards/MainCard';

// assets
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CircleIcon from '@mui/icons-material/Circle';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


// Services
import { buscarBancosSelect, buscarMovimentoFinanceiro, buscarEmpresasSelect, buscarContasBancariasSelect, exportarMovimentoFinanceiroExcel, exportarMovimentoFinanceiroPdf, buscarCategoriasMovimentoSelect } from '../../../services/financeiro';
import { buscarEscritoriosSelect, buscarFornecedoresSelect } from '../../../services/inventario';

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

const MovimentoFinanceiro = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [movimentoFinanceiro, setMovimentoFinanceiro] = useState([]);
   const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);
   const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
   const [tipoSelecionado, setTipoSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);
   
   // Selects
   const [bancos, setBancos] = useState([]);
   const [empresas, setEmpresas] = useState([]);
   const [contasBancarias, setContasBancarias] = useState([]);
   const [escritorios, setEscritorios] = useState([]);
   const [fornecedores, setFornecedores] = useState([]);
   const [categorias, setCategorias] = useState([]);
   
   // Cards
   const [despesa, setDespesa] = useState(null);
   const [receita, setReceita] = useState(null);
   const [saldo, setSaldo] = useState(null);

   // Modal
   const [openModal, setOpenModal] = useState(false);

   // drawer
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   // Modal
   const [openModalSelect, setOpenModalSelect] = useState(false);

   // Drop menu
   const [openDropdown, setOpenDropdown] = useState(null);

   const getMovimentoFinanceiro = async(filtro, empresaId) => {
      const result = await buscarMovimentoFinanceiro(user, filtro ? filtro : { data_atual: moment(`${moment().format('YYYY-MM-DD')} 00:00:00`).format() }, empresaId ?? empresaSelecionada?.id);
      if(result){
         const { dados, receita, despesa, saldo } = result;

         setMovimentoFinanceiro(dados);
         setReceita(funcoes.formatarMoeda(receita));
         setDespesa(funcoes.formatarMoedaMilhar(despesa));
         setSaldo(funcoes.formatarMoedaMilhar(saldo));
      }
   }

   const handleExportMovFinanceiro = async(type) => {
      switch (type) {
         case 'excel':
            await exportarMovimentoFinanceiroExcel(user, filtro, empresaSelecionada?.id);
         break;

         case 'pdf':
            await exportarMovimentoFinanceiroPdf(user, filtro, empresaSelecionada?.id);
         break;

         default:
         break;
      }
      
      // handleLoad(true);
      // handleLoad(false);
   }
   
   function handleActions(action, value){
      switch (action) {
         case 'receita':
            if(bancos.length <= 0) return toast.info('Nenhum banco cadastrado, favor cadastrar!');
            if(contasBancarias.length <= 0) return toast.info('Nenhuma conta cadastrada, favor cadastrar!');
            setTipoSelecionado(1);
            
            setOpenDropdown(null);
            setOpenModal(!openModal);
         break;
         case 'despesa':
            if(bancos.length <= 0) return toast.info('Nenhum banco cadastrado, favor cadastrar!');
            if(contasBancarias.length <= 0) return toast.info('Nenhuma conta cadastrada, favor cadastrar!');
            setTipoSelecionado(2);

            setOpenDropdown(null);
            setOpenModal(!openModal);
         break;
         case 'changeEmpresa':
            setOpenDropdown(null);
            setOpenModalSelect(true);
         break;
         case 'editar':
            if(bancos.length <= 0) return toast.info('Nenhum banco cadastrado, favor cadastrar!');

            setTipoSelecionado(value.mov_tipo_id);
            setMovimentoSelecionado(value);
            setOpenModal(!openModal);
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
      await getMovimentoFinanceiro(data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getMovimentoFinanceiro();
      handleLoad(false);
   }

   async function handleCloseModalAdd(){
      await getMovimentoFinanceiro(filtro);
      await getCategorias(filtro);
      setOpenModal(false);
      setMovimentoSelecionado(null);
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

   async function getContasBancarias(empresaId){
      const result = await buscarContasBancariasSelect(user, empresaId);
      setContasBancarias(result);
   }
   
   async function getEscritorios(){
      const result = await buscarEscritoriosSelect(user);
      setEscritorios(result);
   }

   async function getFornecedores(){
      const result = await buscarFornecedoresSelect(user);
      setFornecedores(result);
   }

   async function getCategorias(){
      const result = await buscarCategoriasMovimentoSelect(user);
      setCategorias(result);
   }

   async function handleSelectEmpresa(empresa){
      handleLoad(true);
      setEmpresaSelecionada(empresa);
      await getMovimentoFinanceiro(null, empresa.id);
      await getContasBancarias(empresa.id);
      setOpenModalSelect(false);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         await getEmpresas();
         await getBancos();
         await getEscritorios();
         await getFornecedores();
         await getCategorias();
      }

      initComponent();
   }, []);

   const datatable = {
      columns: [
         { name: '#', selector: row => row.mov_tipo, grow: 0, sortable: true },
         { name: 'Conta Bancária', selector: row => row.mov_conta_bancaria, sortable: true },
         { name: 'Escritório', selector: row => row.mov_escritorio, sortable: true },
         { name: 'Descrição', selector: row => row.mov_descricao, sortable: true },
         { name: 'Criado por', selector: row => row.mov_criado_por, sortable: true },
         { name: 'Criado em', selector: row => row.mov_criado_em, sortable: true },
         { name: 'Valor', selector: row => row.mov_valor, sortable: true },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         movimentoFinanceiro &&
         movimentoFinanceiro.map((x) => ({
            mov_tipo: (
               <CircleIcon sx={{ color: x.mov_tipo_id == 1 ? '#16C64F' : '#d50000' }} />
            ),
            mov_conta_bancaria: x.conta_bancaria ? funcoes.camelCase(x.conta_bancaria.con_nome) : 'SEM CONTA BANCÁRIA!',
            mov_escritorio: x.escritorio ? funcoes.camelCase(x.escritorio.esc_nome) : 'SEM ESCRITÓRIO!',
            mov_descricao: x.mov_descricao ? funcoes.camelCase(funcoes.limitarTexto(x.mov_descricao, 20)) : 'SEM DESCRIÇÃO!',
            mov_criado_por: x.usuario ? x.usuario.usu_nome : 'NÃO ENCONTRADO!',
            mov_criado_em: x.mov_criado_em ? moment(x.mov_criado_em).format('DD/MM/YYYY') : 'NÃO ENCONTRADO!',
            mov_valor: (
               <Typography color={x.mov_tipo_id == 1 ? '#16C64F' : '#d50000'} fontWeight={500} fontSize={15}>
                  {x.mov_valor ? (x.mov_tipo_id == 1 ? '+ ' : '- ') + funcoes.formatarMoeda(x.mov_valor) : 'SEM VALOR!'}
               </Typography>
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
         <MainCard sx={{marginBottom: '10px'}}>
            <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} lg={3} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="left">
                                Período Verificado
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h3" align="left">
                                 {
                                 !filtro && empresaSelecionada ? 
                                    moment().format('DD/MM/YYYY') : 
                                    ( 
                                       filtro ? `${filtro.mov_data_inicio ? moment(filtro.mov_data_inicio?.$d).format('DD/MM/YYYY') + ' -' : 'Até '} ${filtro.mov_data_fim ? moment(filtro.mov_data_fim?.$d).format('DD/MM/YYYY') : 'O Momento'}` : 
                                       '00/00/0000' 
                                    ) 
                                 }
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <LinearProgress variant="determinate" value={100} color="primary" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={3} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="left">
                                Receita
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h3" align="left">
                                R$ {!empresaSelecionada ? '0,00' : receita}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {/** had wrong colour, colour is an enum not string */}
                            <LinearProgress
                                variant="determinate"
                                value={100}
                                sx={{
                                    bgcolor: theme.palette.success.light,
                                    '& .MuiLinearProgress-bar': { bgcolor: theme.palette.success.main }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={3} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="left">
                                Despesa
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h3" align="left">
                              R$ {!empresaSelecionada ? '0,00' : despesa}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {/** had wrong colour, colour is an enum not string */}
                            <LinearProgress
                                variant="determinate"
                                value={100}
                                sx={{
                                    bgcolor: theme.palette.error.light,
                                    '& .MuiLinearProgress-bar': { bgcolor: theme.palette.error.main }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={3} sm={6}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="left">
                                Saldo em conta
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h3" align="left">
                              R$ {!empresaSelecionada ? '0,00' : saldo}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <LinearProgress
                                variant="determinate"
                                value={100}
                                sx={{
                                    bgcolor: theme.palette.orange.light,
                                    '& .MuiLinearProgress-bar': { bgcolor: theme.palette.orange.main }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
         </MainCard>
         <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
            <Avatar
               variant="rounded"
               sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  backgroundColor:
                        theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary.main,
                  color: '#FFF',
                  zIndex: 1,
                  borderRadius: 1.5,
                  height: '36px',
                  width: '36px',
               }}
               aria-controls="menu-dropdown"
               aria-haspopup="true"
               onClick={(e)=> setOpenDropdown(e.currentTarget)}
            >
               <MoreHorizIcon fontSize="inherit" />
            </Avatar>
            <Menu
               id="menu-dropdown"
               anchorEl={openDropdown}
               keepMounted
               open={Boolean(openDropdown)}
               onClose={()=> setOpenDropdown(null)}
               variant="selectedMenu"
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
               }}
               transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
               }}
            >
               <MenuItem onClick={()=> handleActions('receita')} sx={{ pb: 1 }}>
                  <AddCircleOutlineIcon sx={{ mr: 1.75, color: '#16C64F' }} /> RECEITA
               </MenuItem>
               <MenuItem onClick={()=> handleActions('despesa')} sx={{ pb: 1 }}>
                  <RemoveCircleOutlineIcon sx={{ mr: 1.75, color: '#d50000' }} /> DESPESA
               </MenuItem>
               <hr />
               <MenuItem onClick={()=> handleExportMovFinanceiro('excel')} sx={{ pb: 1 }}>
                  <InsertDriveFileIcon sx={{ mr: 1.75, color: '#16C64F' }} /> EXPORTAR EXCEL
               </MenuItem>
               <MenuItem onClick={()=> handleExportMovFinanceiro('pdf')} sx={{ pb: 1 }}>
                  <PictureAsPdfIcon sx={{ mr: 1.75, color: '#d50000' }} /> EXPORTAR PDF
               </MenuItem>
               {
                  empresaSelecionada &&
                  <hr />
               }
               {
                  empresaSelecionada &&
                  <MenuItem onClick={()=> handleActions('changeEmpresa')} sx={{ pb: 1 }}>
                     <SyncAltIcon sx={{ mr: 1.75 }} /> ALTERAR EMPRESA
                  </MenuItem>
               }
            </Menu>
            <Tooltip title="Filtrar">
               <Button
                  variant="contained"
                  size="medium"
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
                     size="medium"
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
               <Typography fontWeight={500} fontSize={16} color='primary'>
                  Empresa: {funcoes.camelCase(empresaSelecionada.label)}
               </Typography>
            }
         </Stack>
         <DateTable
            linhas={datatable.rows || []}
            colunas={datatable.columns || []}
         />

         <AddMovimentoFinanceiro 
            open={openModal} 
            movimentoSelecionado={movimentoSelecionado}
            tipoSelecionado={tipoSelecionado}
            empresaSelecionada={empresaSelecionada}
            escritorios={escritorios}
            contasBancarias={contasBancarias}
            fornecedores={fornecedores}
            categorias={categorias}
            handleCloseModal={handleCloseModalAdd}
         />

         <FiltroMovimentoFinanceiro 
            open={openDrawerFiltro} 
            handleDrawerOpen={setOpenDrawerFiltro} 
            empresaSelecionada={empresaSelecionada} 
            escritorios={escritorios}
            contasBancarias={contasBancarias}
            fornecedores={fornecedores}
            categorias={categorias}
            filtro={filtro} 
            handleFiltro={handleFilter} 
         />

         <ModalSelectEmpresa open={openModalSelect} setOpen={setOpenModalSelect} empresas={empresas} acao={handleSelectEmpresa} />
      </>
   );
};

export default MovimentoFinanceiro;
