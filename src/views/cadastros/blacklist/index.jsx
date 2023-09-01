import { useState, useEffect } from 'react';

// material-ui
import { Button, Stack, Tooltip } from '@mui/material';

// assets
import AddIcon from '@mui/icons-material/Add';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

// hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// projects imports
import MainCard from '@/ui-component/cards/MainCard';
import moment from 'moment';

// components
import { DateTable } from "../../../components/DataTable";

// services api
import { listar, salvar, bloquear } from "../../../services/blacklist"

const Blacklist = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [registros, setRegistros] = useState([]);
  const [datatable, setDatatable] = useState({})

  useEffect(() => {
    handleListar();
  }, []);

  useEffect(() => {
    setDatatable({
      columns: [
        { name: '#ID', selector: row => row.codigo_blc, grow: 0 },
        { name: 'CNPJ', selector: row => row.cnpj_blc },
        { name: 'EMPRESA', selector: row => row.razaosocial_emp },
        { name: 'BLOQUEADO EM', selector: row => row.bloqueadoem_blc },
        { name: 'BLOQUEADO POR', selector: row => row.nome_usu },
        { name: 'AÇÃO', selector: row => row.acao }
      ],
      rows: registros
        && registros.map(item => ({
          codigo_blc: item.codigo_blc,
          cnpj_blc: item.cnpj_blc,
          razaosocial_emp: item.razaosocial_emp
            ? formatarListaRazaoSocial(item.razaosocial_emp)
            : item.empresa_rai
              ? formatarListaRazaoSocial(item.empresa_rai)
              : "",
          bloqueadoem_blc: item.bloqueadoem_blc
            ? `Bloqueado no dia ${moment(item.bloqueadoem_blc).format("DD/MM/YYYY HH:mm:ss")}`
            : "",
          nome_usu: item.nome_usu
            ? (<strong>{item.nome_usu}</strong>)
            : "",
          acao: !item.bloqueadoem_blc
            ? (
              <Button
                variant="contained"
                size="small"
                color="warning"
                endIcon={<DoDisturbIcon />}
                onClick={() => handleBloquear(item.cnpj_blc)}
              >
                Bloquear CNPJ
              </Button>
            )
            : ("")
        }))
    })
  }, [registros])

  async function handleListar() {
    try {
      handleLoad(true);
      const resposta = await listar(user.token);
      setRegistros(resposta.dados);
    } catch (error) {
      toast.error("Ocorreu um erro ao listar os registros");
    } finally {
      handleLoad(false);
    }
  }

  async function handleBloquear(cnpj) {
    Swal.fire({
      title: "Bloquear CNPJ?",
      text: "Ação irreversível",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#71869d",
      cancelButtonText: "Não, quero cancelar",
      confirmButtonColor: "#d33",
      confirmButtonText: "Sim, quero bloquear",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        handleLoad(true)
        try {
          const resposta = await bloquear({ cnpj_blc: cnpj })
          if (resposta.retorno) {
            Swal.fire("Sucesso", "O CNPJ foi bloqueado com sucesso.", "success")
          }
        } catch (error) {
          toast.error("Ocorreu um erro ao bloquear o CNPJ")
        } finally {
          await handleListar()
          handleLoad(false)
        }
      } else {
        Swal.fire("Operação Cancelada", "O CNPJ não foi bloqueado.", "info")
      }
    })
  }

  function formatarListaRazaoSocial(razaoSocial) {
    const contemVirgula = razaoSocial ? razaoSocial.includes(",") : null
    if (!contemVirgula && razaoSocial) {
      return (
        <ul>
          <li>{razaoSocial}</li>
        </ul>
      )
    }

    const auxRazaoSocial = razaoSocial ? razaoSocial.split(",") : null
    return (
      <ul>
        {
          auxRazaoSocial?.map(item => (
            <li>{item}</li>
          ))
        }
      </ul>
    )
  }

  return (
    <MainCard
      content={false}
      title="Data Tables"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Adicionar Ativo">
            <Button
              variant="contained"
              size="small"
              color="primary"
              endIcon={<AddIcon />}
            >
              Adicionar
            </Button>
          </Tooltip>
        </Stack>
      }
    >

      <DateTable
        linhas={datatable.rows || []}
        colunas={datatable.columns || []}
      />
    </MainCard>
  );
};

export default Blacklist;
