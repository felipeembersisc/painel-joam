import { useEffect } from 'react';

// material-ui
import { Grid, Button } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';

// Components
import { InputForm } from '../../../components/InputForm';
import { SimpleModal } from '../../../components/Modal';

// Forms
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// Plugins
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Apis
import { salvar } from "../../../services/blacklist"

const schema = yup.object({
   cnpj_blc: yup.string().required('Campo Obrigatório')
});

const defaultValues = {
   cnpj_blc: null
};

const ModalCadastro = ({ open, setOpen, listar }) => {
   const { user } = useAuth();
   const { handleLoad } = useLoad();

   const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

   useEffect(() => {
      reset(defaultValues);
   }, [open])

   async function handleSalvar(data) {
      try {
         handleLoad(true)
         const resposta = await salvar(user.token, data);
         if (resposta.retorno) {
            setOpen(!open);
            toast.success("O CNPJ foi salvo com sucesso");
            await listar();
         }
      } catch (error) {
         toast.error("Ocorreu um erro ao salvar o formulário");
      } finally {
         handleLoad(false)
      }
   }

   return (
      <>
         <SimpleModal
            open={open}
            setOpen={setOpen}
            title="Adicionar Blacklist"
            actions={
               <Grid container spacing={2} justifyContent={"end"}>
                  <Grid item>
                     <Button variant="contained" color="secondary" onClick={() => {
                        setOpen(!open);
                        reset(defaultValues);
                     }}>Fechar
                     </Button>
                  </Grid>
                  <Grid item>
                     <Button variant="contained" type="submit" onClick={handleSubmit(handleSalvar)}>Salvar</Button>
                  </Grid>
               </Grid>
            }
            style={{
               width: { xs: 280, lg: 600 },
               maxHeight: '90vh',
               overflowY: 'auto',
            }}
         >
            <Grid item xs={12} marginBottom={2}>
               <SubCard title="Blacklist CNPJ">
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <InputForm
                           name="cnpj_blc"
                           type="cpfCnpj"
                           control={control}
                           variant='outlined'
                           label="CNPJ"
                           error={errors?.cnpj_blc?.message}
                        />
                     </Grid>
                  </Grid>
               </SubCard>
            </Grid>
         </SimpleModal>
      </>
   );
};

export default ModalCadastro;