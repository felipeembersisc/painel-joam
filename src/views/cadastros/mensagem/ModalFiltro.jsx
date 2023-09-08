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

const schema = yup.object({
  titulo_men: yup.string().nullable(),
  texto_men: yup.string().nullable()
});

const defaultValues = {
  codigo_pro: null,
  titulo_men: null,
  texto_men: null,
};

const ModalFiltro = ({ open, setOpen, listar, produtos }) => {
  const { handleLoad } = useLoad();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
  }, [open])

  async function handleListar(data) {
    try {
      handleLoad(true);
      const { codigo_pro, titulo_men, texto_men } = data;
      await listar(codigo_pro, titulo_men, texto_men);
      setOpen(!open);
    } catch (error) {
      toast.error("Ocorreu um erro, ao listar os dados do cnae");
    } finally {
      handleLoad(false);
    }
  }

  return (
    <>
      <SimpleModal
        open={open}
        setOpen={setOpen}
        title="Filtros"
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
              <Button variant="contained" type="submit" onClick={handleSubmit(handleListar)}>Salvar</Button>
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
                  variant='outlined'
                  label="Título"
                  error={errors?.titulo_men?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <InputForm
                  name="texto_men"
                  control={control}
                  variant='outlined'
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

export default ModalFiltro;