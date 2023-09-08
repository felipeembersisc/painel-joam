import { useEffect } from 'react';

// material-ui
import { Grid, Button } from '@mui/material';
import SubCard from '@/ui-component/cards/SubCard';

// Hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';

// Components
import { InputForm } from '../../../components/InputForm';
import { SelectForm } from '../../../components/SelectForm';
import { SimpleModal } from '../../../components/Modal';

// Forms
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

// Plugins
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Apis
import { salvar } from "../../../services/mensagem"

const schema = yup.object({
  titulo_men: yup.string().nullable().required('Campo Obrigatório'),
  texto_men: yup.string().nullable().required('Campo Obrigatório')
});

const defaultValues = {
  codigo_men: null,
  codigo_pro: null,
  titulo_men: null,
  texto_men: null,
};

const ModalCadastro = ({ open, setOpen, listar, produtos, mensagem, setMensagem }) => {
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
    if (!open) setMensagem(null);
    if (mensagem) {
      const keys = Object.keys(mensagem);
      const values = Object.values(mensagem);
      keys.map((key, i) => {
        setValue(key, values[i]);
      })
    }
  }, [open])

  async function handleSalvar(data) {
    try {
      handleLoad(true)
      const resposta = await salvar(user.token, data);

      if (resposta?.id) {
        setOpen(!open);
        toast.success("mensagem salva com sucesso");
        await listar(null, null, null, null, 1);
      } else {
        throw Error();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar a mensagem");
    } finally {
      handleLoad(false)
    }
  }

  return (
    <>
      <SimpleModal
        open={open}
        setOpen={setOpen}
        title={mensagem ? "Editar" : "Adicionar"}
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
          <SubCard title="MENSAGEM">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SelectForm
                  name="codigo_pro"
                  control={control}
                  label="Produto"
                  options={produtos ?? []}
                  error={errors?.codigo_pro?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputForm
                  name="titulo_men"
                  control={control}
                  variant="outlined"
                  label="Nome"
                  error={errors?.titulo_men?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputForm
                  name="texto_men"
                  control={control}
                  variant="outlined"
                  label="Texto"
                  error={errors?.texto_men?.message}
                  multiline
                  rows={3}
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