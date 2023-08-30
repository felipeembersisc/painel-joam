import { useEffect, useState } from 'react';

// material-ui
import { Stack, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid, Tooltip, IconButton } from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SyncIcon from '@mui/icons-material/Sync';

// Components
import { SimpleModal } from '../../../../components/Modal';
import { InputForm } from '../../../../components/InputForm';
import { toast } from 'react-toastify';
import  FlatList  from  'flatlist-react' ;

// ==============================|| ADD ITENS TRANSFERENCIA ||============================== //

const AddItensTransferencia = ({ open, setOpen, handleAddItens, itensTransferencia, inventario, centroCustoOrigem }) => {

   const [filtro, setFiltro] = useState('');
   const [itensPesquisa, setItensPesquisa] = useState([]);
   const [qtd, setQtd] = useState([]);
   const [limiteListagem, setLimiteListagem] = useState('50');

   const hasMoreItems = limiteListagem < (itensPesquisa.length > 0 ? itensPesquisa.length : inventario.length);

   function handleChangeQtd(valor, valorTotal, id){
      if(valor <= 0){
         return toast.info('Quantidade Não Permitida 😅');
      }

      if(valor > valorTotal){
         return toast.info('Quantidade indisponivel 😅');
      }

      let validacao = qtd.find(qt => qt.id === id);

      if(validacao){
         let auxQtd = qtd.map(qt => {
            if(qt.id === id){
               return {...qt, quantidade: Number(valor) };
            }else{
               return qtd;
            }
         })

         setQtd(auxQtd);
      }else{
         setQtd([ ...qtd, { id, quantidade: Number(valor) }]);
      }
   }

   function handlePesquisaAtivo(){ 
      if(filtro && filtro.length <= 0){
         return toast.info('Informe um valor para a pesquisa 😅');
      }

      const resultPesquisa = inventario.filter(inv => {
         let auxAtivo = inv.ativos;

         let auxTipo = auxAtivo.tipo_ativo?.tpa_nome.toLowerCase();
         let auxFabricante = auxAtivo.fabricante_ativo.fab_nome?.toLowerCase();
         let auxModelo = auxAtivo.modelo_ativo.mod_nome?.toLowerCase();
         let auxPatrimonio = auxAtivo.ati_patrimonio?.toLowerCase();
         let auxCentroCusto = inv.centro_de_custo?.cdc_nome?.toLowerCase();

         if(
            auxTipo?.includes(filtro.toLowerCase()) || 
            auxFabricante?.includes(filtro.toLowerCase()) || 
            auxModelo?.includes(filtro.toLowerCase()) ||
            auxPatrimonio?.includes(filtro.toLowerCase()) ||
            auxCentroCusto?.includes(filtro.toLowerCase())
         ){
            return inv;
         }
      });

      if(resultPesquisa.length <= 0){
         return toast.info('Nenhum ativo encontrado 😅');
      }else{
         setItensPesquisa(resultPesquisa);
      }
   }

   function renderItemLista(row, index){
      let ativos = row?.ativos;
      if(!ativos) return;

      return (
         <TableRow hover key={index}>
            <TableCell>{row.centro_de_custo ? row.centro_de_custo.cdc_nome : 'Sem Centro de Custo'}</TableCell>
            <TableCell>{!ativos.ati_patrimonio ? 'Sem Patrimônio' : ativos.ati_patrimonio}</TableCell>
            <TableCell>{ativos.tipo_ativo.tpa_nome}</TableCell>
            <TableCell>{ativos.fabricante_ativo.fab_nome}</TableCell>
            <TableCell>{ativos.modelo_ativo.mod_nome}</TableCell>
            <TableCell>{row.ine_qtd}</TableCell>
            <TableCell sx={{maxWidth: '100px'}}>
               <InputForm
                  name="qtd_itens"
                  type="number"
                  label='Qtd:'
                  variant='outlined'
                  onChange={(e) => handleChangeQtd(e.target.value, row.ine_qtd, row.ine_id)}
                  value={qtd.find(qt => qt.id === row.ine_id)?.quantidade ?? 1}
                  disabled={itensTransferencia.filter(item => item.ine_id === row.ine_id).length > 0 || centroCustoOrigem && centroCustoOrigem !== row.ine_centro_custo_id}
               />   
            </TableCell>
            <TableCell>
               {
                  itensTransferencia.filter(item => item.ine_id === row.ine_id).length > 0 ?
                     <Button variant="outlined" size="medium" color="error" onClick={()=> handleAddItens({...row, ine_qtd: qtd.find(qt => qt.id === row.ine_id)?.quantidade ?? 1})}>
                        Remover
                     </Button>   
                  :
                     <Button variant="outlined" size="medium" color="success" disabled={centroCustoOrigem && centroCustoOrigem !== row.ine_centro_custo_id} onClick={()=> handleAddItens({...row, ine_qtd: qtd.find(qt => qt.id === row.ine_id)?.quantidade ?? 1})}>
                        Adicionar
                     </Button>   
               }
            </TableCell>
         </TableRow>
      )
   }

   function handleGetMoreItems(){
      setLimiteListagem(String(Number(limiteListagem) + 50));
   }

   function limparCampos(){
      setItensPesquisa([]);
      setQtd([]);
      setFiltro('');
      setLimiteListagem('50');
   }

   useEffect(() => {
      if(!open){
         limparCampos();
      }
   }, [open])

   return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Resultado da Pesquisa"
            style= {{
               width: { xs: 280, lg: 1280 },
               maxHeight: '90vh',
               overflowY: 'auto',
            }}
         >
            <TableContainer sx={{overflowY: 'auto', maxHeight: '70vh'}}>
               <Grid container mb={4} my={1} spacing={2}>   
                  <Grid item xs={11}>
                     <InputForm
                        name="pesquisa_itens"
                        label='Pesquisar:'
                        variant='outlined'
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                     />
                  </Grid>
                  <Grid item xs={1}>
                     <Tooltip placement="top" title="Pesquisar">
                        <IconButton color="inherit" aria-label="pesquisar" size="large" onClick={handlePesquisaAtivo}>
                           <ManageSearchIcon fontSize='80px'/>
                        </IconButton>
                     </Tooltip>
                  </Grid>
               </Grid>
               {/* <Stack mr={4} my={2}>
                  <InputForm
                     name="pesquisa_itens"
                     label='Pesquisar:'
                     variant='outlined'
                     value={filtro}
                     onChange={(e) => setFiltro(e.target.value)}
                  />
               </Stack> */}
               <Table>
                  <TableHead>
                     <TableRow>
                           <TableCell>Centro de Custo</TableCell>
                           <TableCell>Patrimônio</TableCell>
                           <TableCell>Tipo</TableCell>
                           <TableCell>Fabricante</TableCell>
                           <TableCell>Modelo</TableCell>
                           <TableCell>Disponivel</TableCell>
                           <TableCell>Qtd.</TableCell>
                           <TableCell>
                              Ação
                           </TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     <>
                        <FlatList
                           list = { itensPesquisa.length > 0 ? itensPesquisa : inventario }
                           renderItem = {renderItemLista}
                           renderWhenEmpty = { () => <div> Nenhum ativo encontrado! </div> }
                           limit={limiteListagem}
                        />
                        {/* <Stack display='flex' justifyContent='center' height='80px'>
                           <Tooltip title="Carregar mais">
                              <Button
                                 variant="contained"
                                 size="small"
                                 color="secondary"
                                 onClick={handleGetMoreItems}
                                 endIcon={<SyncIcon />}
                              >
                                 CARREGAR MAIS
                              </Button>
                           </Tooltip>
                        </Stack> */}
                     </>
                  </TableBody>
               </Table>
               <Stack display='flex' justifyContent='center' alignItems='center' width='100%' height='80px'>
                  <Tooltip title="Carregar mais">
                     <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleGetMoreItems}
                        endIcon={<SyncIcon />}
                     >
                        CARREGAR MAIS
                     </Button>
                  </Tooltip>
               </Stack>
            </TableContainer>
         </SimpleModal>
      </>
   );
};

export default AddItensTransferencia;