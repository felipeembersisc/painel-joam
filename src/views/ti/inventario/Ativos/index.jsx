import { useState, useEffect } from 'react';

// material-ui
import { Button, Chip, IconButton, Stack, Tooltip } from '@mui/material';

// project import
import AddAtivo from './AddAtivo';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import ExposureIcon from '@mui/icons-material/Exposure';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

// Services
import { buscarAtivos, buscarCentrosCustoSelect, buscarEscritorios, buscarFuncionarios } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import FiltroAtivo from './FiltroAtivo';
import HistoricoAtivo from './HistoricoAtivo';
import moment from 'moment';

// Exports
import { ExcelExport } from '../../../../utils/excelexport';
import GerenciarQuantidade from './GerenciarQuantidade';
import AddAtivosEscritorio from './AddAtivosEscritorio';
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// ==============================|| ATIVOS ||============================== //

const Ativos = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [ativos, setAtivos] = useState([]);
   const [ativosExcel, setAtivosExcel] = useState([]);
   const [ativoSelecionado, setAtivoSelecionado] = useState(null);
   const [filtro, setFiltro] = useState(null);
   const [funcionarios, setFuncionarios] = useState([]);
   const [escritorios, setEscritorios] = useState([]);
   const [centrosCusto, setCentrosCusto] = useState([]);

   // Modal
   const [openModalHistorico, setOpenModalHistorico] = useState(false);
   const [openModalQuantidade, setOpenModalQuantidade] = useState(false);
   const [openAddDocumento, setOpenAddDocumento] = useState(false);

   // drawer
   const [openDrawer, setOpenDrawer] = useState(false);
   const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

   // function createPdf(){
   //    if(ativosExcel.length <= 0){
   //       return toast.info('Nenhum dado encontrado 😅');
   //    }

   //    // const contentPdf = {
   //    //    pageSize: 'A4',
   //    //    pageMargins: [14, 53, 14, 50],
   //    //    header: function () {
   //    //       return {
   //    //          margin: [14, 12, 14, 0],
   //    //          layout: 'noBorders',
   //    //          table: {
   //    //             widths: ['*'],
   //    //             body: [                             
   //    //                [
   //    //                   { text: `RELATÓRIO DE ATIVOS - ${moment().format('DD/MM/YYYY')}`, style: 'reportName' }
   //    //                ]
   //    //             ],
   //    //          },
   //    //       };
   //    //    },
   //    //    content: [{
   //    //       layout: 'noBorders',
   //    //       table: {              
   //    //          headerRows: 1,
   //    //          widths: [ '*', 55, 55, 55, 55, 55, 55 ],
   //    //          body: [
   //    //             [
   //    //                { text: 'Profissional', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //                { text: 'Associado', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //                { text: 'Campanha', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //                { text: 'Lançado em', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //                { text: 'Vendido em', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //                { text: 'Pontos', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //                { text: 'Valor', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
   //    //             ],
   //    //             [
   //    //                {
   //    //                   text: '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
   //    //                   alignment: 'center',
   //    //                   fontSize: 5,
   //    //                   colSpan: 7,
   //    //                },
   //    //                {},
   //    //                {},
   //    //                {},
   //    //                {},
   //    //                {},
   //    //                {},
   //    //             ],
   //    //             ...pontuacaoPdf.map((prod) => {

   //    //                if(prod?.totalAqui){
   //    //                   let auxReturn = null;

   //    //                   auxReturn = [
   //    //                      {}, 
   //    //                      {}, 
   //    //                      {}, 
   //    //                      {}, 
   //    //                      { text: 'Total:', bold: true, fontSize: 9, margin: [0, 10, 0, 10] }, 
   //    //                      { text: totalPontos, bold: true, fontSize: 9, margin: [0, 10, 0, 10] },
   //    //                      { text: funcoes.formatarMoeda(totalVendas), bold: true, fontSize: 9, margin: [0, 10, 0, 10] }
   //    //                   ];

   //    //                   totalPontos = 0;
   //    //                   totalVendas = 0;

   //    //                   return auxReturn;
   //    //                }else{
   //    //                   totalPontos = totalPontos + prod.total_pontos;
   //    //                   totalVendas = totalVendas + prod.total_venda;

   //    //                   return [
   //    //                      { text: prod.profissional, fontSize: 8 },
   //    //                      { text: prod.associado, fontSize: 8 },
   //    //                      { text: prod.campanha, fontSize: 8 },
   //    //                      { text: prod.lancado_em, fontSize: 8 },
   //    //                      { text: prod.data_venda, fontSize: 8 },
   //    //                      { text: prod.total_pontos, fontSize: 8 },
   //    //                      { text: funcoes.formatarMoeda(prod.total_venda), fontSize: 8 },
   //    //                   ];
   //    //                }
   //    //             }),
   //    //             [
   //    //                {}, 
   //    //                {}, 
   //    //                {}, 
   //    //                {}, 
   //    //                { text: 'Total:', bold: true, fontSize: 9, margin: [0, 10, 0, 0] }, 
   //    //                { text: totalPontos, bold: true, fontSize: 9, margin: [0, 10, 0, 0] },
   //    //                { text: funcoes.formatarMoeda(totalVendas), bold: true, fontSize: 9, margin: [0, 10, 0, 0] }
   //    //             ]
   //    //          ]
   //    //       }
   //    //    }],
   //    //    footer(currentPage, pageCount) {
   //    //       return {
   //    //          layout: 'noBorders',
   //    //          margin: [14, 0, 14, 22],
   //    //          table: {
   //    //             widths: ['auto'],
   //    //             body: [
   //    //             [
   //    //                { text: 'Filtros selecionados:' }
   //    //             ],
   //    //             [
   //    //                {
   //    //                   ul: auxUlFiltros,
   //    //                   fontSize: 9,
   //    //                   margin: [0, 5, 0, 0],
   //    //                }
   //    //             ], 
   //    //             [
   //    //                {
   //    //                   text:
   //    //                   '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
   //    //                   alignment: 'center',
   //    //                   fontSize: 5,
   //    //                },
   //    //             ],
   //    //             [
   //    //                [
   //    //                   {
   //    //                   text: `Página ${currentPage.toString()} de ${pageCount}`,
   //    //                   fontSize: 7,
   //    //                   alignment: 'right',
   //    //                   /* horizontal, vertical */
   //    //                   margin: [3, 0],
   //    //                   },
   //    //                   {
   //    //                   text: '© Poupacred',
   //    //                   fontSize: 7,
   //    //                   alignment: 'center',
   //    //                   },
   //    //                ],
   //    //             ],
   //    //             ],
   //    //          },
   //    //       };
   //    //    },
   //    //    styles: {
   //    //       reportName: {
   //    //          fontSize: 9,
   //    //          bold: true,
   //    //          alignment: 'center',
   //    //          margin: [0, 4, 0, 0],
   //    //       }
   //    //    }
   //    // }
      
   //    // const pdfGenerator = pdfMake.createPdf(contentPdf);
   //    // pdfGenerator.open();
   // }

   const getAtivos = async(user, filtro) => {
      const result = await buscarAtivos(user, filtro);
      setAtivos(result);

      let auxAtivos = result.map(ati => {
         return { 
            id: ati.ati_id,
            tipo_ativo: ati.tipo_ativo?.tpa_nome,
            patrimonio: ati.ati_patrimonio,
            numero_de_serie: ati.ati_numero_serie,
            tipo: ati.tipo_ativo?.tpa_nome,
            modelo: ati.modelo_ativo?.mod_nome,
            fabricante: ati.fabricante_ativo?.fab_nome,
            imei1: ati.ati_imei_1,
            imei2: ati.ati_imei_2,
            observacao: ati.ati_observacao,
            status: ati.status_ativo?.sta_nome
         }
      })

      setAtivosExcel(auxAtivos);
   }

   const getFuncionarios = async() => {
      const result = await buscarFuncionarios(user);
      setFuncionarios(result);
   }

   const getEscritorios = async() =>{
      const result = await buscarEscritorios(user);
      setEscritorios(result);
   }

   const getCentrosCusto = async() =>{
      const result = await buscarCentrosCustoSelect(user);
      setCentrosCusto(result);
   }

   const handleEdit = async(data) => {
      setAtivoSelecionado(data);
      setOpenDrawer(!openDrawer);
   }

   const handleHistory = async(data) => {
      setAtivoSelecionado(data);
      setOpenModalHistorico(!openModalHistorico);
   }

   const handleQuantidade = async(data) => {
      setAtivoSelecionado(data);
      setOpenModalQuantidade(!openModalQuantidade);
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

   async function getAtivosCloseDrawer(){
      handleLoad(true);
      await getAtivos(user, filtro);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         await getAtivos(user);
         await getFuncionarios();
         await getEscritorios();
         await getCentrosCusto();
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.ati_id, grow: 0 },
         { name: 'Patrimônio', selector: row => row.ati_patrimonio },
         { name: 'Tipo', selector: row => row.tipo_ativo },
         { name: 'Fabricante', selector: row => row.fabricante_ativo },
         { name: 'Modelo', selector: row => row.modelo_ativo },
         { name: 'Status', selector: row => row.status_ativo },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         ativos &&
         ativos.map((x) => ({
            ati_id: x.ati_id,
            ati_patrimonio: !x.ati_patrimonio ? 'Sem Patrimônio' : x.ati_patrimonio,
            tipo_ativo: x.tipo_ativo.tpa_nome,
            fabricante_ativo: x.fabricante_ativo?.fab_nome,
            modelo_ativo: x.modelo_ativo?.mod_nome,
            status_ativo: (
               <Chip
                  label={x.status_ativo?.sta_nome}
                  size="medium"
                  sx={{ 
                     color: x.ati_status_id == 1 ? 'success.main' : x.ati_status_id == 2 ? 'primary.main' : x.ati_status_id == 3 ? 'warning.main' : 'error.main',
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
                  <Tooltip placement="top" title="Histórico">
                     <IconButton color="primary" aria-label="editar" size="large" onClick={()=> handleHistory(x)}>
                        <HistoryIcon sx={{ fontSize: '1.2rem' }} />
                     </IconButton>
                  </Tooltip>
                  {
                     !x.ati_patrimonio &&
                     <Tooltip placement="top" title="Editar Qtd">
                        <IconButton color="primary" aria-label="editar" size="large" onClick={()=> handleQuantidade(x)}>
                           <ExposureIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                     </Tooltip>
                  }
               </Stack>
            )
      }))
   };

    return (
        <>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
               <Tooltip title="Adicionar Ativo">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpenDrawer(!openDrawer)}
                     endIcon={<AddIcon />}
                  >
                     ADD ÚNICO
                  </Button>
               </Tooltip>
               <Tooltip title="Adicionar Ativo">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpenAddDocumento(!openAddDocumento)}
                     endIcon={<PlaylistAddIcon />}
                  >
                     ADD MUITOS
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
               {/* <ExcelExport excelData={ativosExcel} fileName={`Ativos-${moment().format('DDMMYYYY')}`}/> */}
               {/* <Tooltip title="Filtrar">
                  <Button
                     variant="contained"
                     size="small"
                     color="error"
                     onClick={createPdf}
                     endIcon={<PictureAsPdfIcon />}
                  >
                     EXPORTAR PDF
                  </Button>
               </Tooltip> */}
            </Stack>
            <DateTable
               linhas={datatable.rows || []}
               colunas={datatable.columns || []}
            />

            <AddAtivo open={openDrawer} handleDrawerOpen={setOpenDrawer} ativoSelecionado={ativoSelecionado} setAtivoSelecionado={setAtivoSelecionado} getAtivosCloseDrawer={getAtivosCloseDrawer} escritorios={escritorios} centrosCusto={centrosCusto}/>
            <AddAtivosEscritorio open={openAddDocumento} setOpen={setOpenAddDocumento} escritorios={escritorios} centrosCusto={centrosCusto} getAtivos={getAtivos}/>
            <HistoricoAtivo open={openModalHistorico} setOpen={setOpenModalHistorico} ativoSelecionado={ativoSelecionado} escritorios={escritorios} funcionarios={funcionarios}/>
            <FiltroAtivo open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} funcionarios={funcionarios} escritorios={escritorios}/>
            <GerenciarQuantidade open={openModalQuantidade} setOpen={setOpenModalQuantidade} ativoSelecionado={ativoSelecionado} setAtivoSelecionado={setAtivoSelecionado} escritorios={escritorios} centrosCusto={centrosCusto}/>
        </>
    );
};

export default Ativos;
