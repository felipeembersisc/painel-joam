import { useEffect, useState } from 'react';

// material-ui
import { Button, Grid, Stack, Tooltip } from '@mui/material';

// Services
import { salvarChecklistInventario } from '../../../../services/inventario';

// Hooks
import useAuth from '../../../../hooks/useAuth';
import { useLoad } from '../../../../hooks/useLoad';

// Components
import { SimpleModal } from '../../../../components/Modal';

// Utils
import { InputForm } from '../../../../components/InputForm';

// ==============================|| KANBAN BACKLOGS - ADD STORY ||============================== //

const ObservacaoInventario = ({ open, setOpen, funcionarioDestino, escritorioDestino, observacao, getCheckListCloseModalObservacao }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const [textObservacao, setTextObservacao] = useState('');

   async function handleSave(){
      handleLoad(true);

      if(funcionarioDestino || escritorioDestino){
         if(funcionarioDestino && escritorioDestino){
            await salvarChecklistInventario(user, { textObservacao, funcionarioDestino, escritorioDestino: null });
         }else{
            await salvarChecklistInventario(user, { textObservacao, funcionarioDestino, escritorioDestino });
         }
      }

      await getCheckListCloseModalObservacao();
      setOpen(!open);
      setTextObservacao('');
      handleLoad(false);
   }

   useEffect(() => {
      if(observacao.type == 'novo'){
         setTextObservacao('');
      }else{
         setTextObservacao(observacao.value);
      }
   },[observacao])

   return (
      <SimpleModal
         open={open}
         setOpen={setOpen}
         title="Observação do Inventário"
         style= {{
            width: { xs: 280, lg: 800 },
         }}
      >
         <Grid item xs={12}>
            <InputForm
               name="observacao_reprova"
               variant='outlined'
               onChange={(e)=> setTextObservacao(e.target.value)}
               value={textObservacao}
               placeholder={`Informe caso você possua um item que não esteja na lista, ou exista um item na lista que você não possui. Ex:\nPossuo:\n- 1 Mouse Logitech M90\nNão Possuo:\n- 1 Monitor Samsung patrimônio 0001`}
               multiline
               disabled={observacao.type == 'ver'}
               rows={8}
            />
         </Grid>
         {
            observacao.type == 'novo' &&
            <Stack display='grid' gridTemplateColumns='1fr 1fr' gap={4} marginTop={5} paddingBottom={2}>
               <Tooltip title="Reprovar">
                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     onClick={()=> setOpen(!open)}
                     sx={{height: '40px'}}
                  >
                     CANCELAR
                  </Button>
               </Tooltip>
               <Tooltip title="Aprovar">
                  <Button
                     variant="contained"
                     size="small"
                     color="success"
                     onClick={handleSave}
                     sx={{height: '40px'}}
                  >
                     CONFIRMAR
                  </Button>
               </Tooltip>
            </Stack>
         }
      </SimpleModal>
   );
};

export default ObservacaoInventario;
