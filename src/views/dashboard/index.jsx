import { useState, useEffect, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Checkbox, Chip, FormControlLabel, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import SideIconCard from '@/ui-component/cards/SideIconCard';
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone';
import EmojiEmotionsTwoToneIcon from '@mui/icons-material/EmojiEmotionsTwoTone';
import HandymanIcon from '@mui/icons-material/Handyman';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Redux
import { gridSpacing } from '@/store/constant';

// Components
import { DateTable } from '../../components/DataTable';

// Services
import { buscarAtivosAssinados, buscarAtivosInventario, buscarCentrosCustoSelect, buscarChecklistInventario, buscarEscritorios, buscarFuncionarios, salvarCheckTermo, verificarObservacaoChecklist } from '../../services/inventario';

// Hooks
import useAuth from '../../hooks/useAuth';
import { useLoad } from '../../hooks/useLoad';
import ObservacaoInventario from './ObservacaoInventario';
import { SelectForm } from '../../components/SelectForm';
import moment from 'moment';
import funcoes from '../../utils/funcoes';
import { ExcelExport } from '../../utils/excelexport';
import ValidarAtivos from './ValidarAtivos';
import { toast } from 'react-toastify';

// ===========================|| WIDGET STATISTICS ||=========================== //


const DashBoard = () => {
   const { user } = useAuth();
   const funUser = user.funcionario;

   const theme = useTheme();
   const { handleLoad } = useLoad();

   const [ativos, setAtivos] = useState([]);
   const [ativosExcel, setAtivosExcel] = useState([]);
   const [checklist, setChecklist] = useState([]);
   const [qtdItens, setQtdItens] = useState({});

   const [funcionarios, setFuncionarios] = useState([]);
   const [escritorios, setEscritorios] = useState([]);
   const [centrosCusto, setCentrosCusto] = useState([]);
   const [itensAssinados, setItensAssinados] = useState({});

   const [funcionariosFiltrados, setFuncionariosFiltrados] = useState([]);
   const [escritoriosFiltrados, setEscritoriosFiltrados] = useState([]);

   const [escritorioSelecionado, setEscritorioSelecionado] = useState(null);
   const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
   const [centroCustoSelecionado, setCentroCustoSelecionado] = useState(null);
   const [observacao, setObservacao] = useState({});
   const [observacaoFiltro, setObservacaoFiltro] = useState({
      pendentes: true,
      aprovadas: false,
      rejeitadas: false
   });

   //  Validação
   const [disabledFuncionario, setDisabledFuncionario] = useState(false);
   const [hasItensNaoAssinados, setHasItensNaoAssinados] = useState(false);


   // Modal
   const [openModalObservacao, setOpenModalObservacao] = useState(false);
   const [openModalValidar, setOpenModalValidar] = useState(false);

   const getAtivos = async (user, filtro) => {
      const result = await buscarAtivosInventario(user, filtro);
      setAtivos(result);

      let auxAtivos = 0, auxQuebrados = 0, auxManutencao = 0, auxEmprestados = 0;

      if (result.length > 0) {
         const resultAssinados = await buscarAtivosAssinados(user, filtro);
         let auxItensAssinados = [];

         result.map(item => {
            if (resultAssinados?.hat_itens_inventario?.length > 0) {
               resultAssinados.hat_itens_inventario?.map(res => {
                  if (item.ine_id == res.ine_id && item.ine_qtd == res.qtd && item.ine_ativo_id == res.ativo_id) {
                     auxItensAssinados.push(item.ine_id);
                  }
               })
            }

            switch (item.ativos.ati_status_id) {
               case 1:
                  auxAtivos += item.ine_qtd;
                  break;
               case 2:
                  auxManutencao += item.ine_qtd;
                  break;
               case 3:
               case 4:
                  auxQuebrados += item.ine_qtd;
                  break;
            }

            if (!item.ine_in_escritorio) {
               auxEmprestados += item.ine_qtd;
            }
         })

         if (result.length !== auxItensAssinados.length) {
            setHasItensNaoAssinados(true);
         } else {
            setHasItensNaoAssinados(false);
         }

         setItensAssinados({ assinadoEm: resultAssinados?.hat_assinado_em ? moment(resultAssinados.hat_assinado_em).format('DD/MM/YYYY') : null, itens: auxItensAssinados });
      }


      setQtdItens({ ativos: auxAtivos, quebrados: auxQuebrados, manutencao: auxManutencao, emprestados: auxEmprestados });

      let auxAtivosExcel = result.map(ati => {
         return {
            id: ati?.ativos.ati_id,
            tipo: ati?.ativos.tipo_ativo?.tpa_nome,
            modelo: ati?.ativos.modelo_ativo?.mod_nome,
            fabricante: ati?.ativos.fabricante_ativo?.fab_nome,
            patrimonio: ati?.ativos.ati_patrimonio,
            quantidade: ati?.ine_qtd,
            ['numero de serie']: ati?.ativos.ati_numero_serie,
            imei1: ati?.ativos.ati_imei_1,
            imei2: ati?.ativos.ati_imei_2,
            escritorio: ati?.escritorio?.esc_nome,
            responsavel: ati?.funcionario_responsavel?.fun_nome,
            ['centro de custo']: ati?.centro_de_custo?.cdc_nome,
            observacao: ati?.ativos.ati_observacao,
            status: ati?.ativos.status_ativo?.sta_nome
         }
      })

      setAtivosExcel(auxAtivosExcel);
   }

   const getChecklistInventario = async (user, filtro) => {
      const result = await buscarChecklistInventario(user, filtro);
      setChecklist(result);
   }

   const getEscritorios = async () => {
      const result = await buscarEscritorios(user);
      setEscritorios(result);
      // if(funUser.fun_escritorio_id.includes(1)){
      //    setEscritoriosFiltrados(result);
      // }else{
      setEscritoriosFiltrados(result.filter(res => user.funcionario.fun_escritorio_id.includes(res.id)));
      // }
   }

   const getCentrosCusto = async () => {
      const result = await buscarCentrosCustoSelect(user);
      setCentrosCusto(result);
   }

   const getFuncionarios = async () => {
      const result = await buscarFuncionarios(user);
      setFuncionarios(result);

      if (funUser.fun_escritorio_id.includes(1)) {
         setFuncionariosFiltrados(result);
      } else {
         if (![1, 2].includes(1)) {
            setFuncionariosFiltrados(result.filter(res => res.id == funUser.fun_id));
         } else {
            setFuncionariosFiltrados(result.filter(res => res.fun_escritorio_id.includes(...funUser.fun_escritorio_id)));
         }
      }
   }

   async function handleEdit(type, data) {
      try {
         handleLoad(true);

         switch (type) {
            case 'nova-observacao':
               setOpenModalObservacao(!openModalObservacao);
               setObservacao({ type: 'novo', value: null });
               break;
            case 'ver-observacao':
               setOpenModalObservacao(!openModalObservacao);
               setObservacao({ type: 'ver', value: data.che_observacao });
               break;
            case 'validar-ativos':
               if (ativos.length <= 0) {
                  return toast.info('Nenhum ativo a ser validado 😅');
               }

               if (![1, 2].includes(1) && !funcionarioSelecionado) {
                  return toast.info('Selecione um Funcionário 😅');
               }

               if (!user.funcionario.fun_escritorio_id.includes(escritorioSelecionado)) {
                  return toast.info('Não é possivel assinar termo de outro escritório 😮');
               }

               if (funcionarioSelecionado && funcionarioSelecionado !== user.funcionario.fun_id) {
                  return toast.info('Não é possivel assinar termo de outro funcionário 😮');
               }

               setOpenModalValidar(!openModalValidar);
               break;
            case 'aprovar':
               await verificarObservacaoChecklist(user, type, data.che_id);
               await getChecklistInventario(user);
               break;
            case 'rejeitar':
               await verificarObservacaoChecklist(user, type, data.che_id);
               await getChecklistInventario(user);
               break;
            case 'observacoes-pendentes':
               if (observacaoFiltro.pendentes && !observacaoFiltro.aprovadas && !observacaoFiltro.rejeitadas) {
                  setChecklist([]);
               } else {
                  await getChecklistInventario(user, { ...observacaoFiltro, pendentes: !observacaoFiltro.pendentes });
               }

               setObservacaoFiltro({ ...observacaoFiltro, pendentes: !observacaoFiltro.pendentes });
               break;
            case 'observacoes-aprovadas':
               if (!observacaoFiltro.pendentes && observacaoFiltro.aprovadas && !observacaoFiltro.rejeitadas) {
                  setChecklist([]);
               } else {
                  await getChecklistInventario(user, { ...observacaoFiltro, aprovadas: !observacaoFiltro.aprovadas });
               }

               setObservacaoFiltro({ ...observacaoFiltro, aprovadas: !observacaoFiltro.aprovadas })
               break;
            case 'observacoes-rejeitadas':
               if (!observacaoFiltro.pendentes && !observacaoFiltro.aprovadas && observacaoFiltro.rejeitadas) {
                  setChecklist([]);
               } else {
                  await getChecklistInventario(user, { ...observacaoFiltro, rejeitadas: !observacaoFiltro.rejeitadas });
               }

               setObservacaoFiltro({ ...observacaoFiltro, rejeitadas: !observacaoFiltro.rejeitadas })
               break;
            case 'funcionario':
               setFuncionarioSelecionado(data ? data.id : null);
               await getAtivos(user, { funcionario_id: data ? data.id : null, escritorio_id: escritorioSelecionado ?? null, centro_custo_id: centroCustoSelecionado });
               break;
            case 'centroCusto':
               setCentroCustoSelecionado(data ? data.id : null);
               await getAtivos(user, { centro_custo_id: data ? data.id : null, funcionario_id: funcionarioSelecionado, escritorio_id: escritorioSelecionado ?? null });
               break;
            case 'escritorio':
               setEscritorioSelecionado(data ? data.id : null);
               setFuncionariosFiltrados(data?.id ? funcionarios.filter(fun => fun.fun_escritorio_id.includes(data.id)) : []);
               await getAtivos(user, { escritorio_id: data ? data.id : null, centro_custo_id: centroCustoSelecionado, funcionario_id: funcionarioSelecionado });
               break;
         }
      } catch (error) {
      } finally {
         handleLoad(false);
      }
   }

   async function getCheckListCloseModalObservacao() {
      await getChecklistInventario(user, { ...observacaoFiltro });
   }

   async function handleCheckTermoCompromisso() {
      let itens = ativos.map(item => {
         return { ine_id: item.ine_id, ativo_id: item.ine_ativo_id, qtd: item.ine_qtd, in_escritorio: item.ine_in_escritorio }
      });

      let isTermoSupervisor = [1, 2].includes(1) && !funcionarioSelecionado;
      let escritorioId = escritorioSelecionado;
      let funcionarioId = funcionarioSelecionado;

      handleLoad(true);
      await salvarCheckTermo(user, itens, isTermoSupervisor, escritorioId, funcionarioId);
      await getAtivos(user, { funcionario_id: funcionarioSelecionado, escritorio_id: escritorioSelecionado, centro_custo_id: centroCustoSelecionado });
      setOpenModalValidar(!openModalValidar);
      handleLoad(false);
   }

   const datatablechecklist = {
      columns: [
         { name: '#', selector: row => row.che_id, grow: 0 },
         { name: 'Responsável', selector: row => row.responsavel },
         { name: 'Gerado em:', selector: row => row.che_gerado_em },
         { name: 'Observação', selector: row => row.che_observacao, grow: 2 },
         { name: 'Status', selector: row => row.che_is_aprovado },
         { name: 'Ação', selector: row => row.acao },
      ],
      rows:
         checklist &&
         checklist.map((x) => ({
            che_id: x.che_id,
            responsavel: x.escritorio?.esc_nome ?? x.funcionario?.fun_nome,
            che_gerado_em: moment(x.che_gerado_em).format('DD/MM/YYYY'),
            che_is_aprovado: (
               <Chip
                  label={x.che_is_aprovado == true ? 'Aprovado' : x.che_is_aprovado == false ? 'Rejeitado' : 'Pendente'}
                  size="medium"
                  sx={{
                     color: x.che_is_aprovado == true ? 'success.main' : x.che_is_aprovado == false ? 'error.main' : 'warning.main',
                     fontWeight: 'medium'
                  }}
               />
            ),
            che_observacao: (
               <>
                  {funcoes.limitarTexto(x.che_observacao, 50)}
                  <Tooltip sx={{ flex: 1 }} placement="top" title="Ver Completo">
                     <IconButton color="primary" aria-label="editar" size="large" onClick={() => handleEdit('ver-observacao', x)}>
                        <VisibilityIcon sx={{ fontSize: '1.2rem' }} />
                     </IconButton>
                  </Tooltip>
               </>
            ),
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  {
                     x.che_is_aprovado !== true &&
                     <Tooltip placement="top" title="Aprovar">
                        <IconButton color="success" aria-label="editar" size="large" onClick={() => handleEdit('aprovar', x)}>
                           <ThumbUpIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                     </Tooltip>
                  }
                  {
                     x.che_is_aprovado !== false &&
                     <Tooltip placement="top" title="Rejeitar">
                        <IconButton color="error" aria-label="editar" size="large" onClick={() => handleEdit('rejeitar', x)}>
                           <ThumbDownAltIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                     </Tooltip>
                  }
               </Stack>
            )
         }))
   };

   const datatable = {
      columns: [
         { name: 'Termo Assinado?', selector: row => row.ine_termo_assinado, sortable: true },
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
            ine_termo_assinado: (
               <Chip
                  label={itensAssinados?.itens?.includes(x.ine_id) ? 'Sim' : 'Não'}
                  size="medium"
                  sx={{
                     color: itensAssinados?.itens?.includes(x.ine_id) ? 'success.main' : 'error.main',
                     fontWeight: 'medium'
                  }}
               />
            ),
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

   useEffect(() => {
      async function init() {
         handleLoad(true);

         if (![1, 2].includes(1)) {
            setFuncionarioSelecionado(user.funcionario.fun_id);
            setDisabledFuncionario(true);
         }

         await getEscritorios();
         await getCentrosCusto();
         await getFuncionarios();
         await getChecklistInventario(user, { ...observacaoFiltro });

         // if(funUser.fun_escritorio_id.includes(1)){
         //    await getAtivos(user);
         // }
         handleLoad(false);
      }

      init();
   }, []);

   return (
      <>
         <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={3} sm={6}>
               <SideIconCard
                  iconPrimary={EmojiEmotionsTwoToneIcon}
                  primary={String(qtdItens?.ativos ?? '0')}
                  secondary="Itens"
                  secondarySub="Ativos"
                  color={theme.palette.success.dark}
               />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
               <SideIconCard
                  iconPrimary={MoodBadIcon}
                  primary={String(qtdItens?.quebrados ?? '0')}
                  secondary="Itens"
                  secondarySub="Quebrados"
                  color={theme.palette.secondary.main}
               />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
               <SideIconCard
                  iconPrimary={HandymanIcon}
                  primary={String(qtdItens?.manutencao ?? '0')}
                  secondary="Itens em"
                  secondarySub="Manutenção"
                  color={theme.palette.warning.main}
               />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
               <SideIconCard
                  iconPrimary={AccountBalanceWalletTwoToneIcon}
                  primary={String(qtdItens?.emprestados ?? '0')}
                  secondary="Itens"
                  secondarySub="Emprestados"
                  color={theme.palette.primary.dark}
               />
            </Grid>

            {/* {
               funUser.fun_escritorio_id.includes(1) && */}
            <Grid item xs={12}>
               <MainCard sx={{ '&>div': { p: 0, pb: '0px !important' } }}>
                  <Box sx={{ p: 3 }}>
                     <Stack display='flex' flexDirection='row' alignItems='center' gap={5}>
                        <Typography fontSize={22} fontWeight='medium'>
                           Observações
                        </Typography>
                        <Grid container spacing={2}>
                           <Grid item>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       defaultChecked
                                       checked={observacaoFiltro.pendentes}
                                       onChange={() => handleEdit('observacoes-pendentes')}
                                       color='warning'
                                       sx={{
                                          color: theme.palette.warning.main,
                                          '&.Mui-checked': { color: theme.palette.warning.main }
                                       }}
                                    />
                                 }
                                 label="Pendentes"
                              />
                           </Grid>
                           <Grid item>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={observacaoFiltro.aprovadas}
                                       onChange={() => handleEdit('observacoes-aprovadas')}
                                       color='success'
                                       sx={{
                                          color: theme.palette.success.main,
                                          '&.Mui-checked': { color: theme.palette.success.main }
                                       }}
                                    />
                                 }
                                 label="Aprovadas"
                              />
                           </Grid>
                           <Grid item>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       checked={observacaoFiltro.rejeitadas}
                                       onChange={() => handleEdit('observacoes-rejeitadas')}
                                       color='error'
                                       sx={{
                                          color: theme.palette.error.main,
                                          '&.Mui-checked': { color: theme.palette.error.main }
                                       }}
                                    />
                                 }
                                 label="Rejeitadas"
                              />
                           </Grid>
                        </Grid>
                     </Stack>
                     <DateTable
                        linhas={datatablechecklist.rows || []}
                        colunas={datatablechecklist.columns || []}
                        options={{
                           paginationPerPage: 5
                        }}
                     />
                  </Box>
               </MainCard>
            </Grid>
            {/* } */}

            <Grid item xs={12}>
               <Stack bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingTop={3} borderRadius='5px 5px 0px 0px'>
                  <Typography fontSize={22} fontWeight='medium'>Ativos Vinculados</Typography>
               </Stack>
               <Stack display='grid' gridTemplateColumns='200px 200px 200px' gap={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingTop={3}>
                  <Tooltip title="Reprovar">
                     <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => handleEdit('nova-observacao')}
                        endIcon={<AnnouncementIcon />}
                        disabled={!escritorioSelecionado && !funcionarioSelecionado}
                        sx={{ height: '50px' }}
                     >
                        NOVA OBSERVAÇÃO
                     </Button>
                  </Tooltip>
                  <Tooltip title="Verificar">
                     <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => handleEdit('validar-ativos')}
                        endIcon={!escritorioSelecionado || (escritorioSelecionado && hasItensNaoAssinados) || ativos.length <= 0 && <CheckCircleOutlineIcon />}
                        disabled={(!escritorioSelecionado && !funcionarioSelecionado) || !hasItensNaoAssinados || ativos.length <= 0}
                        sx={{ height: '50px' }}
                     >
                        {!escritorioSelecionado || (escritorioSelecionado && hasItensNaoAssinados) || ativos.length <= 0 ? 'VALIDAR ATIVOS' : `ASSINADO EM ${itensAssinados.assinadoEm}`}
                     </Button>
                  </Tooltip>
                  <ExcelExport excelData={ativosExcel} fileName={`Ativos-${moment().format('DDMMYYYY')}`} />
               </Stack>
               <Stack display='grid' gridTemplateColumns='1fr 1fr 1fr' gap={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3}>
                  <SelectForm
                     label='Escritório'
                     value={escritorioSelecionado}
                     onChange={(e, value) => handleEdit('escritorio', value)}
                     options={escritoriosFiltrados.length > 0 ? escritoriosFiltrados : escritorios ?? []}
                     disableClearable
                  />
                  <SelectForm
                     label='Centro de Custo'
                     value={centroCustoSelecionado}
                     onChange={(e, value) => handleEdit('centroCusto', value)}
                     options={centrosCusto ?? []}
                  />
                  <SelectForm
                     label='Funcionário'
                     value={funcionarioSelecionado}
                     onChange={(e, value) => handleEdit('funcionario', value)}
                     disabled={!escritorioSelecionado || disabledFuncionario}
                     options={funcionariosFiltrados.length > 0 ? funcionariosFiltrados : funcionarios ?? []}
                  />
               </Stack>
               <MainCard sx={{ '&>div': { p: 0, pb: '0px !important' } }}>
                  <Box sx={{ p: 3 }}>
                     <DateTable
                        linhas={datatable.rows || []}
                        colunas={datatable.columns || []}
                     />
                  </Box>
               </MainCard>
            </Grid>
         </Grid>

         <ObservacaoInventario open={openModalObservacao} setOpen={setOpenModalObservacao} funcionarioDestino={funcionarioSelecionado} escritorioDestino={escritorioSelecionado} observacao={observacao} getCheckListCloseModalObservacao={getCheckListCloseModalObservacao} />
         <ValidarAtivos open={openModalValidar} setOpen={setOpenModalValidar} handleCheckTermoCompromisso={handleCheckTermoCompromisso} />
      </>
   );
};

export default DashBoard;
