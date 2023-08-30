// material-ui
import { Grid } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Utils
import { InputForm } from '../../../../components/InputForm';
import moment from 'moment';

// ==============================|| DETALHES DO LOG ||============================== //

const DetalhesLog = ({ open, setOpen, logErro }) => {
   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Detalhes do Erro"
         style= {{
            width: { xs: 280, lg: 1280 },
            maxHeight: '90vh',
            overflowY: 'auto',
         }}
      >
         <Grid item xs={12} marginBottom={2}>
            <SubCard title="Detalhes">
               <Grid container spacing={2}>
                  <Grid item xs={4}>
                     <InputForm
                        name="log_rota"
                        label='Rota do erro:'
                        variant='outlined'
                        value={logErro?.log_rota ? logErro.log_rota : '-'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="log_criado_em"
                        label='Data do erro:'
                        variant='outlined'
                        value={logErro?.log_criado_em ? moment(logErro.log_criado_em).format('DD/MM/YYYY HH:mm:ss') : '-'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={4}>
                     <InputForm
                        name="usuario_criou"
                        label='Usuário do erro:'
                        variant='outlined'
                        value={logErro?.usuario_criou && logErro.usuario_criou?.usu_nome}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="log_json"
                        label='Objeto enviado:'
                        variant='outlined'
                        value={logErro?.log_json ? JSON.stringify(logErro.log_json, '', 4) : '-'}
                        readOnly
                        multiline
                        rows={20}
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="log_message"
                        label='Log simples:'
                        variant='outlined'
                        value={logErro?.log_message ? logErro.log_message : '-'}
                        readOnly
                        multiline
                        rows={20}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <InputForm
                        name="log_completo"
                        label='Log completo:'
                        variant='outlined'
                        value={logErro?.log_completo ? JSON.stringify(logErro.log_completo, '', 4) : '-'}
                        readOnly
                        multiline
                     />
                  </Grid>
               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
   );
};

export default DetalhesLog;
