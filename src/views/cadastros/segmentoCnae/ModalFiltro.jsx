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

const schema = yup.object({
  nome_sgc: yup.string().nullable()
});

const defaultValues = {
  nome_sgc: null
};

const ModalFiltro = ({ open, setOpen, listar }) => {
  const { handleLoad } = useLoad();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
  }, [open])

  async function handleListar(data) {
    try {
      handleLoad(true);
      const { nome_sgc } = data;
      await listar(null, null, nome_sgc, 1);
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
          <SubCard title="SEGMENTO CNAE">
            <Grid container spacing={2}>
              <Grid item xs={8}>
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

export default ModalFiltro;