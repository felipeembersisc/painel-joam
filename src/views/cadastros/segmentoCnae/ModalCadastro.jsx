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
import { salvar } from "../../../services/segmentoCnae"

const schema = yup.object({
  secao_sgc: yup.string().nullable().required('Campo Obrigatório'),
  divisaoinicial_sgc: yup.string().nullable().required('Campo Obrigatório'),
  divisaofinal_sgc: yup.string().nullable().required('Campo Obrigatório'),
  nome_sgc: yup.string().nullable().required('Campo Obrigatório')
});

const defaultValues = {
  codigo_sgc: null,
  secao_sgc: null,
  divisaoinicial_sgc: null,
  divisaofinal_sgc: null,
  nome_sgc: null,
};

const ModalCadastro = ({ open, setOpen, listar, segmentoCnae, setSegmentoCnae }) => {
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
    if (!open) setSegmentoCnae(null);
    if (segmentoCnae) {
      const keys = Object.keys(segmentoCnae);
      const values = Object.values(segmentoCnae);
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
        toast.success("Segmento salvo com sucesso");
        await listar(null, null, null, 1);
      } else {
        throw Error();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar o segmento do cnae");
    } finally {
      handleLoad(false)
    }
  }

  return (
    <>
      <SimpleModal
        open={open}
        setOpen={setOpen}
        title={segmentoCnae ? "Editar" : "Adicionar"}
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
          <SubCard title="SEGMENTO CNAE">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <InputForm
                  name="secao_sgc"
                  control={control}
                  variant='outlined'
                  label="Seção"
                  error={errors?.secao_sgc?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <InputForm
                  name="divisaoinicial_sgc"
                  control={control}
                  variant='outlined'
                  label="Divisão Inicial"
                  error={errors?.divisaoinicial_sgc?.message}
                />
              </Grid>

              <Grid item xs={4}>
                <InputForm
                  name="divisaofinal_sgc"
                  control={control}
                  variant='outlined'
                  label="Divisão Final"
                  error={errors?.divisaofinal_sgc?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <InputForm
                  name="nome_sgc"
                  control={control}
                  variant='outlined'
                  label="Nome"
                  error={errors?.nome_sgc?.message}
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