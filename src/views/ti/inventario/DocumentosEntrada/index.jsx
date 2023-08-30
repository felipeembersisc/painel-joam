import { useState, useEffect } from 'react';

// material-ui
import { Button, IconButton, Stack, Tooltip } from '@mui/material';

// assets
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Services
import { buscarCentrosCustoSelect, buscarDocumentosEntrada, buscarEscritorios, buscarFornecedoresSelect, buscarUrlDocumento } from '../../../../services/inventario';

// Utils
import funcoes from '../../../../utils/funcoes';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// Components
import { DateTable } from "../../../../components/DataTable";
import moment from 'moment/moment';
import FiltroDocumento from './FiltroDocumento';
import AddDocumento from './AddDocumento';
import EditArquivo from './EditArquivo';

// ==============================|| DOCUMENTOS DE ENTRADA ||============================== //

const DocumentosEntrada = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { handleLoad } = useLoad();

    const [documentos, setDocumentos] = useState([]);
    const [escritorios, setEscritorios] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [centrosCusto, setCentrosCusto] = useState([]);
    const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
    const [filtro, setFiltro] = useState(null);

    // Modal
    const [openAddDocumento, setOpenAddDocumento] = useState(false);
    const [openEditDocumento, setOpenEditDocumento] = useState(false);

   //  Drawer
    const [openDrawerFiltro, setOpenDrawerFiltro] = useState(false);

    const getDocumentos = async(user, filtro) => {
      const result = await buscarDocumentosEntrada(user, filtro);
      setDocumentos(result);
    }

    const getEscritorios = async() =>{
      const result = await buscarEscritorios(user);
      setEscritorios(result);
    }

    const getFornecedores = async() =>{
      const result = await buscarFornecedoresSelect(user);
      setFornecedores(result);
    }

    const getCentrosCusto = async() =>{
      const result = await buscarCentrosCustoSelect(user);
      setCentrosCusto(result);
    }

   const handleEdit = async(type, data) => {
      handleLoad(true);
      switch(type){
         case 'novo':
            setDocumentoSelecionado(null);
            setOpenAddDocumento(true);
         break;
         case 'detalhes':
            setDocumentoSelecionado(data);
            setOpenAddDocumento(true);
         break;
         case 'baixar-documento':
            await buscarUrlDocumento(user, data.doc_url);
         break;
         case 'alterar-documento':
            setDocumentoSelecionado(data);
            setOpenEditDocumento(true);
         break;
      }
      handleLoad(false);
   }

   const handleFilter = async(data) => {
      handleLoad(true);
      setFiltro(data);
      await getDocumentos(user, data);
      setOpenDrawerFiltro(!openDrawerFiltro);
      handleLoad(false);
   }

   const handleClearFilter = async() => {
      handleLoad(true);
      setFiltro(null);
      await getDocumentos(user);
      handleLoad(false);
   }

   useEffect(()=> {
      async function initComponent(){
         handleLoad(true);
         await getEscritorios();
         await getFornecedores();
         await getCentrosCusto();
         await getDocumentos(user);
         handleLoad(false);
      }

      initComponent();
   }, [])

   const datatable = {
      columns: [
         { name: '#', selector: row => row.doc_id, grow: 0 },
         { name: 'Fornecedor', selector: row => row.fornecedor_nome },
         { name: 'Destino', selector: row => row.destino_nome },
         { name: 'Nota gerada em', selector: row => row.doc_nota_gerada_em },
         { name: 'Valor total', selector: row => row.doc_valor_total },
         { name: 'Ação', selector: row => row.acao }
      ],
      rows: 
         documentos &&
         documentos.map((x) => ({
            doc_id: x.doc_id,
            fornecedor_nome: funcoes.camelCase(x.fornecedor?.for_nome ?? 'Sem Fornecedor'),
            destino_nome: funcoes.camelCase(x.escritorio_destino?.esc_nome ?? 'Sem Destino'),
            doc_nota_gerada_em: moment(x.doc_nota_gerada_em).format('DD/MM/YYYY'),
            doc_valor_total: `R$ ${funcoes.formatarMoeda(x.doc_valor_total)}`,
            acao: (
               <Stack direction="row" justifyContent="center" alignItems="center">
                  <Tooltip placement="top" title="Ver Detalhes">
                     <IconButton color="primary" aria-label="ver-ativos" size="large" onClick={()=> handleEdit('detalhes', x)}>
                        <AssignmentIcon sx={{ fontSize: '1.2rem' }} />
                     </IconButton>
                  </Tooltip>
                  {
                     x.doc_url &&
                     <>
                        <Tooltip placement="top" title="Baixar Documento">
                           <IconButton color="primary" aria-label="baixar-documento" size="large" onClick={()=> handleEdit('baixar-documento', x)}>
                              <DownloadIcon sx={{ fontSize: '1.2rem' }} />
                           </IconButton>
                        </Tooltip>
                     </>
                  }
                  {
                     x.doc_url &&
                     <>
                        <Tooltip placement="top" title="Alterar Documento">
                           <IconButton color="primary" aria-label="alterar-documento" size="large" onClick={()=> handleEdit('alterar-documento', x)}>
                              <UploadIcon sx={{ fontSize: '1.2rem' }} />
                           </IconButton>
                        </Tooltip>
                     </>
                  }
               </Stack>
            )
      }))
   };

   return (
      <>
         <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} bgcolor={theme.palette.mode === 'dark' ? theme.palette.dark.dark : '#FFF'} paddingX={2} paddingY={3} borderRadius='5px 5px 0px 0px'>
            <Tooltip title="Adicionar Documento">
               <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={()=> handleEdit('novo')}
                  endIcon={<PlaylistAddIcon />}
               >
                  NOVO DOCUMENTO
               </Button>
            </Tooltip>
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
         </Stack>

         <DateTable
            linhas={datatable.rows || []}
            colunas={datatable.columns || []}
         />

         <AddDocumento open={openAddDocumento} setOpen={setOpenAddDocumento} escritorios={escritorios} fornecedores={fornecedores} centrosCusto={centrosCusto} documentoId={documentoSelecionado?.doc_id} getDocumentos={getDocumentos}/>
         <FiltroDocumento open={openDrawerFiltro} handleDrawerOpen={setOpenDrawerFiltro} filtro={filtro} handleFiltro={handleFilter} escritorios={escritorios} fornecedores={fornecedores} centrosCusto={centrosCusto}/>
         <EditArquivo open={openEditDocumento} setOpen={setOpenEditDocumento} documento={documentoSelecionado} getDocumentos={getDocumentos} />
      </>
   );
};

export default DocumentosEntrada;
