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
import { salvar } from "../../../services/origem"

const schema = yup.object({
  nome: yup.string().nullable().required('Campo Obrigatório'),
  observacao: yup.string().nullable().required('Campo Obrigatório'),
});

const defaultValues = {
  codigo: null,
  nome: null,
  observacao: null
};

const ModalCadastro = ({ open, setOpen, listar, origem, setOrigem }) => {
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
    if (!open) setOrigem(null);
    if (origem) {
      const keys = Object.keys(origem);
      const values = Object.values(origem);
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
        toast.success("Origem salva com sucesso");
        await listar(null, null, null, 1);
      } else {
        throw Error();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar a origem");
    } finally {
      handleLoad(false)
    }
  }

  return (
    <>
      <SimpleModal
        open={open}
        setOpen={setOpen}
        title={origem ? "Editar" : "Adicionar"}
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
          <SubCard title="ORIGEM">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputForm
                  name="nome"
                  control={control}
                  variant='outlined'
                  label="Nome"
                  error={errors?.nome?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <InputForm
                  name="observacao"
                  control={control}
                  variant='outlined'
                  label="Observação"
                  error={errors?.observacao?.message}
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