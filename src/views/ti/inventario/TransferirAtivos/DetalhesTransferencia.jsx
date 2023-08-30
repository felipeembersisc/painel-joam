import { useEffect, useState } from 'react';

// material-ui
import { Grid, Chip, InputAdornment, IconButton } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';

// Services
import { buscarAtivosEscritorio, buscarUrlTermo } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
// import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';
import { DateTable } from '../../../../components/DataTable';
// import Visibility from '@mui/icons-material/Visibility';

// Utils
import moment from 'moment';
import { SelectForm } from '../../../../components/SelectForm';
// import { InputForm } from '../../../../components/InputForm';

// ==============================|| DETALHES DA TRANSFERÊNCIA DE ATIVOS ||============================== //

const DetalhesTransferencia = ({ open, setOpen, transferencia, funcionarios, escritorios, centrosCusto }) => {
   const { user } = useAuth();
   // const { handleLoad } = useLoad();

   const [ativos, setAtivos] = useState(null);

   // async function getUrlTermo(){
   //    handleLoad(true);
   //    await buscarUrlTermo(user, transferencia.doc_url);
   //    handleLoad(false);
   // }

   useEffect(()=> {
      if(transferencia?.doc_id){
         async function buscarAtivos(){
            const resultAtivos = await buscarAtivosEscritorio(user, { transferencia: transferencia?.doc_id });
            setAtivos(resultAtivos);
         }

         buscarAtivos();
      }
   }, [transferencia?.doc_id, open == true])

   const datatable = {
      columns: [
         { name: 'Tipo', selector: row => row.tipo_ativo },
         { name: 'Fabricante', selector: row => row.fabricante_ativo },
         { name: 'Modelo', selector: row => row.modelo_ativo },
         { name: 'Patrimonio', selector: row => row.ati_patrimonio },
         { name: 'Quantidade', selector: row => row.ite_qtd },
         { name: 'Status', selector: row => row.status_ativo }
      ],
      rows: 
         ativos &&
         ativos.map((x) => ({
            tipo_ativo: x?.ativos?.tipo_ativo?.tpa_nome,
            fabricante_ativo: x?.ativos?.fabricante_ativo?.fab_nome,
            modelo_ativo: x?.ativos?.modelo_ativo?.mod_nome,
            ati_patrimonio: !x.ativos.ati_patrimonio ? 'Sem Patrimônio' : x.ativos.ati_patrimonio,
            ite_qtd: x.ite_qtd,
            status_ativo: (
               <Chip
                  label={x?.ativos?.status_ativo?.sta_nome}
                  size="medium"
                  sx={{ 
                     color: [1].includes(x?.ativos?.status_ativo?.sta_id) ? 'success.main' : 'warning.main',
                     fontWeight: 'medium'
                  }}
               />
            )
      }))
   };

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Detalhes da Tranferência"
         style= {{
            width: { xs: 280, lg: 1280 },
            maxHeight: '90vh',
            overflowY: 'auto',
         }}
      >
         <Grid item xs={12} marginBottom={2}>
            <SubCard title="Detalhes">
               <Grid container spacing={2}>
                  {
                     transferencia?.doc_funcionario_origem_id &&
                     <Grid item xs={6}>
                        <SelectForm
                           name="funcionario_origem_id"
                           label='Funcionário Origem'
                           value={transferencia.doc_funcionario_origem_id}
                           options={funcionarios ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {
                     transferencia?.doc_escritorio_origem_id &&
                     <Grid item xs={6}>
                        <SelectForm
                           name="escritorio_origem_id"
                           label='Escritório Origem'
                           value={transferencia.doc_escritorio_origem_id}
                           options={escritorios ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {
                     transferencia?.doc_centro_custo_origem_id &&
                     <Grid item xs={6}>
                        <SelectForm
                           name="doc_centro_custo_origem_id"
                           label='Centro de Custo Origem'
                           value={transferencia.doc_centro_custo_origem_id}
                           options={centrosCusto ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {
                     transferencia?.doc_funcionario_destino_id &&
                     <Grid item xs={6}>
                        <SelectForm
                           name="funcionario_destino_id"
                           label='Funcionário Destino'
                           value={transferencia.doc_funcionario_destino_id}
                           options={funcionarios ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {
                     transferencia?.doc_escritorio_destino_id &&
                     <Grid item xs={6}>
                        <SelectForm
                           name="escritorio_destino_id"
                           label='Escritório Destino'
                           value={transferencia.doc_escritorio_destino_id}
                           options={escritorios ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {
                     transferencia?.doc_centro_custo_destino_id &&
                     <Grid item xs={6}>
                        <SelectForm
                           name="doc_centro_custo_destino_id"
                           label='Centro de Custo Destino'
                           value={transferencia.doc_centro_custo_destino_id}
                           options={centrosCusto ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {
                     transferencia?.doc_responsavel_id &&
                     <Grid item xs={12}>
                        <SelectForm
                           name="funcionario_id"
                           label='Responsável'
                           value={transferencia.doc_responsavel_id}
                           options={funcionarios ?? []}
                           readOnly
                        />
                     </Grid>
                  }
                  {/* <Grid item xs={6}>
                     <InputForm
                        name="doc_gerado_em"
                        label='Termo gerado em:'
                        variant='outlined'
                        value={transferencia?.doc_gerado_em ? moment(transferencia.doc_gerado_em).format('DD/MM/YYYY') : 'Sem Data'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="doc_assinado_em"
                        label='Termo assinado em:'
                        variant='outlined'
                        value={transferencia?.doc_assinado_em ? moment(transferencia.doc_assinado_em).format('DD/MM/YYYY') : 'Não Assinado'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <InputForm
                        name="doc_url"
                        label='Termo:'
                        value={transferencia?.doc_url ? transferencia.doc_url.split('/')[2] : 'Termo não enviado'}
                        readOnly
                        endAdornment={
                           transferencia?.doc_url ?
                              <InputAdornment position="end" sx={{paddingRight: '10px'}}>
                                 <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={getUrlTermo}
                                    edge="end"
                                 >
                                    <Visibility />
                                 </IconButton>
                              </InputAdornment>
                           :
                              <></>
                         }
                     />
                  </Grid> */}
               </Grid>
            </SubCard>
         </Grid>
         <Grid item xs={12}>
            <SubCard title="Ativos">
               <Grid container spacing={2}>
                  <DateTable
                     linhas={datatable.rows || []}
                     colunas={datatable.columns || []}
                     options={{
                        pagination: false
                     }}
                  />
               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
   );
};

export default DetalhesTransferencia;
