// material-ui
import { Grid } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Utils
import { InputForm } from '../../../../components/InputForm';
import funcoes from '../../../../utils/funcoes';
import moment from 'moment';

// ==============================|| DETALHES DO LOG ||============================== //

const DetalhesLog = ({ open, setOpen, logAlteracao }) => {
   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Detalhes da Ação"
         style= {{
            width: { xs: 280, lg: 1280 },
            maxHeight: '90vh',
            overflowY: 'auto',
         }}
      >
         <Grid item xs={12} marginBottom={2}>
            <SubCard title="Detalhes">
               <Grid container spacing={2}>
                  <Grid item xs={6}>
                     <InputForm
                        name="log_acao"
                        label='Ação Feita:'
                        variant='outlined'
                        value={logAlteracao?.log_acao ? funcoes.camelCase(logAlteracao.log_acao) : '-'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="log_tabela"
                        label='Tabela da ação:'
                        variant='outlined'
                        value={logAlteracao?.log_tabela ? logAlteracao.log_tabela : '-'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="log_criado_em"
                        label='Data do ação:'
                        variant='outlined'
                        value={logAlteracao?.log_criado_em ? moment(logAlteracao.log_criado_em).format('DD/MM/YYYY HH:mm:ss') : '-'}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={6}>
                     <InputForm
                        name="usuario_criou"
                        label='Usuário da ação:'
                        variant='outlined'
                        value={logAlteracao?.usuario_criou && logAlteracao.usuario_criou?.usu_nome}
                        readOnly
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <InputForm
                        name="log_dados"
                        label='Dados da ação:'
                        variant='outlined'
                        value={logAlteracao?.log_dados ? JSON.stringify(logAlteracao.log_dados, '', 4) : '-'}
                        readOnly
                        multiline
                        rows={20}
                     />
                  </Grid>
               </Grid>
            </SubCard>
         </Grid>
      </SimpleModal>
   );
};

export default DetalhesLog;
