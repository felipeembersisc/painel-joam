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
import { salvar } from "../../../services/cnae"

const schema = yup.object({
  codigo_sgc: yup.number().nullable().transform((value) => isNaN(value) ? null : value).required('Campo obrigatório'),
  nome_cna: yup.string().required('Campo Obrigatório'),
  numero_cna: yup.string().required('Campo Obrigatório')
});

const defaultValues = {
  codigo_sgc: null,
  nome_cna: null,
  numero_cna: null,
};

const ModalCadastro = ({ open, setOpen, listar, segmentos, cnae, setCnae }) => {
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
    if (!open) setCnae(null);
    if (cnae) {
      const keys = Object.keys(cnae);
      const values = Object.values(cnae);
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
        toast.success("CNAE salvo com sucesso");
        await listar(null, null, null, null, 1);
      } else {
        throw Error();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o cnae");
    } finally {
      handleLoad(false)
    }
  }

  return (
    <>
      <SimpleModal
        open={open}
        setOpen={setOpen}
        title={cnae ? "Editar" : "Adicionar"}
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
          <SubCard title="CNAE">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SelectForm
                  name="codigo_sgc"
                  control={control}
                  label="Segmento"
                  options={segmentos ?? []}
                  error={errors?.codigo_sgc?.message}
                />
              </Grid>
              <Grid item xs={8}>
                <InputForm
                  name="nome_cna"
                  control={control}
                  variant='outlined'
                  label="Nome"
                  error={errors?.nome_cna?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <InputForm
                  name="numero_cna"
                  control={control}
                  variant='outlined'
                  label="Número"
                  error={errors?.numero_cna?.message}
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