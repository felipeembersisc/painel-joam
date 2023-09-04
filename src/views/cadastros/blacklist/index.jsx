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
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import "sweetalert2/src/sweetalert2.scss";
import "react-toastify/dist/ReactToastify.css";

// components
import { DateTable } from "../../../components/DataTable";
import ModalCadastro from "./ModalCadastro";

// services api
import { listar, bloquear } from "../../../services/blacklist"

const Blacklist = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [registros, setRegistros] = useState([]);
  const [datatable, setDatatable] = useState({});
  const [abrirModalCadastro, setAbrirModalCadastro] = useState(false);

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
            ? (
              <Tooltip title={formatarListaRazaoSocial(item.razaosocial_emp)}>
                {formatarListaRazaoSocial(item.razaosocial_emp)}
              </Tooltip>
            )
            : item.empresa_rai
              ? (
                <Tooltip title={formatarListaRazaoSocial(item.empresa_rai)}>
                  {formatarListaRazaoSocial(item.empresa_rai)}
                </Tooltip>
              )
              : "",
          bloqueadoem_blc: item.bloqueadoem_blc
            ? `Bloqueado no dia ${moment(item.bloqueadoem_blc).format("DD/MM/YYYY HH:mm:ss")}`
            : "",
          nome_usu: item.nome_usu
            ? (
              <Tooltip title={item.nome_usu}>
                <strong>{item.nome_usu}</strong>
              </Tooltip>
            )
            : "",
          acao: !item.bloqueadoem_blc
            ? (
              <Button
                variant="contained"
                size="small"
                color="warning"
                endIcon={<DoDisturbIcon />}
                onClick={() => handleBloquear(user.token, item.cnpj_blc)}
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

  async function handleBloquear(token, cnpj) {
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
          const resposta = await bloquear(token, { cnpj_blc: cnpj })
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
    <>
      <MainCard
        content={false}
        title="Lista de dados"
        secondary={
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Adicionar">
              <Button
                variant="contained"
                size="small"
                color="primary"
                endIcon={<AddIcon />}
                onClick={() => setAbrirModalCadastro(!abrirModalCadastro)}
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
      <ModalCadastro open={abrirModalCadastro} setOpen={setAbrirModalCadastro} listar={handleListar} />
    </>
  );
};

export default Blacklist;
