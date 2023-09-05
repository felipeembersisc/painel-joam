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
import { salvarConfiguracao } from "../../../services/configuracaoMailing"

const schema = yup.object({
  codigo_sis: yup.number().nullable().transform((value) => isNaN(value) ? null : value).required('Campo obrigatório'),
  qtderegistro_mcf: yup.number().required('Campo Obrigatório'),
  limitesolicitacao_mcf: yup.number().required('Campo Obrigatório'),
  prazomin_mcf: yup.number().required('Campo Obrigatório'),
  prazomax_mcf: yup.number().required('Campo Obrigatório'),
  perctnovo_mcf: yup.number().required('Campo Obrigatório'),
  perctliberacao_mcf: yup.number().required('Campo Obrigatório'),
});

const defaultValues = {
  codigo_mcf: null,
  codigo_sis: null,
  qtderegistro_mcf: null,
  limitesolicitacao_mcf: null,
  prazomin_mcf: null,
  prazomax_mcf: null,
  perctnovo_mcf: null,
  perctliberacao_mcf: null
};

const ModalCadastro = ({ open, setOpen, listar, sistemas, configuracao, setConfiguracao }) => {
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const { control, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    reset(defaultValues);
    if (!open) setConfiguracao(null);
    if (configuracao) {
      const keys = Object.keys(configuracao);
      const values = Object.values(configuracao);
      keys.map((key, i) => {
        setValue(key, values[i]);
      })
    }
  }, [open])

  async function handleSalvar(data) {
    try {
      handleLoad(true)
      const resposta = await salvarConfiguracao(user.token, data);

      if (resposta?.id) {
        setOpen(!open);
        toast.success("Configuração salva com sucesso 😁");
        await listar();
      } else {
        throw Error();
      }
    } catch (error) {
      toast.error("Ocorreu um erro, ao salvar a configuração");
    } finally {
      handleLoad(false)
    }
  }

  return (
    <>
      <SimpleModal
        open={open}
        setOpen={setOpen}
        title={configuracao ? "Editar" : "Adicionar"}
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
          <SubCard title="Configurações Mailing">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {configuracao && configuracao.codigo_sis ? (
                  <InputForm
                    name="nome_sis"
                    control={control}
                    variant='outlined'
                    label="Sistema"
                    error={errors?.nome_sis?.message}
                    disabled
                  />
                ) : (
                  <SelectForm
                    name="codigo_sis"
                    control={control}
                    label="Sistema"
                    options={sistemas ?? []}
                    error={errors?.codigo_sis?.message}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <InputForm
                  name="qtderegistro_mcf"
                  type="number"
                  control={control}
                  variant='outlined'
                  label="Quantide de Registros"
                  error={errors?.qtderegistro_mcf?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputForm
                  name="limitesolicitacao_mcf"
                  type="number"
                  control={control}
                  variant='outlined'
                  label="Limite Solicitação"
                  error={errors?.limitesolicitacao_mcf?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputForm
                  name="prazomin_mcf"
                  type="number"
                  control={control}
                  variant='outlined'
                  label="Prazo Mínimo Atendimento"
                  error={errors?.prazomin_mcf?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputForm
                  name="prazomax_mcf"
                  type="number"
                  control={control}
                  variant='outlined'
                  label="Prazo Máximo Atendimento"
                  error={errors?.prazomin_mcf?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputForm
                  name="perctliberacao_mcf"
                  type="percentual"
                  control={control}
                  variant='outlined'
                  label="Percentual Liberação"
                  error={errors?.perctliberacao_mcf?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <InputForm
                  name="perctnovo_mcf"
                  type="percentual"
                  control={control}
                  variant='outlined'
                  label="Percentual Novo"
                  error={errors?.perctnovo_mcf?.message}
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