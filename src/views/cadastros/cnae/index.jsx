import { useState, useEffect } from 'react';

// material-ui
import { Button, Stack, Tooltip, IconButton } from '@mui/material';

// assets
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

// hooks
import useAuth from '../../../hooks/useAuth';
import { useLoad } from '../../../hooks/useLoad';
import { useTheme } from '@mui/material/styles';

// projects imports
import MainCard from '@/ui-component/cards/MainCard';
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import "sweetalert2/src/sweetalert2.scss";
import "react-toastify/dist/ReactToastify.css";

// components
import { DateTable } from "../../../components/DataTable";
import ModalCadastro from "./ModalCadastro";

// services api
import { listar, listarSegmentos, inativar } from "../../../services/cnae";

const Cnae = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [cnaes, setCnaes] = useState([]);
  const [cnae, setCnae] = useState(null);
  const [segmentos, setSegmentos] = useState([]);
  const [datatable, setDatatable] = useState({});
  const [abrirModalCadastro, setAbrirModalCadastro] = useState(false);

  useEffect(() => {
    listarCnaes(null, null, null, null, 1);
    listarSegmentosCnae();
  }, []);

  useEffect(() => {
    setDatatable({
      columns: [
        { name: '#ID', selector: row => row.codigo_cna, grow: 0 },
        { name: 'DATA CADASTRO', selector: row => row.datacadastro_cna },
        { name: 'NOME', selector: row => row.nome_cna },
        { name: 'NÚMERO', selector: row => row.numero_cna },
        { name: 'SEGMENTO', selector: row => row.nome_sgc },
        { name: 'AÇÃO', selector: row => row.acao }
      ],
      rows: cnaes
        && cnaes.map(item => ({
          codigo_cna: item.codigo_cna,
          datacadastro_cna: item.datacadastro_cna,
          nome_cna: item.nome_cna,
          numero_cna: item.numero_cna,
          nome_sgc: item.nome_sgc,
          acao: (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Tooltip placement="top" title="Editar">
                <IconButton color="primary" aria-label="editar" size="large" onClick={() => handleEditar(item)}>
                  <EditIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Remover">
                <IconButton color="secondary" aria-label="editar" size="large" onClick={() => handleRemover(item.codigo_cna, item.nome_cna)}>
                  <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }))
    })
  }, [cnaes]);

  async function listarCnaes(
    codigo,
    segmento,
    nome,
    numero,
    pagina
  ) {
    try {
      handleLoad(true);
      const dados = await listar(user.token, codigo, segmento, nome, numero, pagina);

      if (dados) {
        setCnaes(dados);
      } else {
        toast.error("Ocorreu um erro ao listar os CNAE!");
      }
    } catch (erro) {
      toast.error(erro.message);
    } finally {
      handleLoad(false);
    }
  }

  async function listarSegmentosCnae() {
    try {
      handleLoad(true);
      const retornoSegmentos = await listarSegmentos(user.token);
      if (retornoSegmentos.retorno) {
        setSegmentos(retornoSegmentos.dados);
      }
    } catch (err) {
      toast.error(err.message ?? err.mensagem);
    } finally {
      handleLoad(false);
    }
  }

  function handleEditar(data) {
    setCnae({
      codigo_cna: data.codigo_cna,
      codigo_sgc: data.codigo_sgc,
      nome_cna: data.nome_cna,
      numero_cna: data.numero_cna

    });
    setAbrirModalCadastro(true);
  }

  async function handleRemover(id, nome) {
    try {
      Swal.fire({
        title: "Remover o CNAE?",
        text: "Remover o cnae: " + nome + "?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#71869d",
        cancelButtonText: "Não, quero cancelar",
        confirmButtonColor: "#d33",
        confirmButtonText: "Sim, pode remover",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          handleLoad(true);
          const resultado = await inativar(user.token, id);
          if (resultado.retorno) {
            Swal.fire(
              "Sucesso",
              "O CNAE foi removido com sucesso.",
              "success"
            );
            await listarCnaes(null, null, null, null, 1);
          } else {
            Swal.fire(
              "Erro",
              "Erro ao remover o CNAE.",
              "error"
            );
          }
        } else {
          Swal.fire(
            "Operação Cancelada",
            "O CNAE não foi removido.",
            "info"
          );
        }
      });
    } catch (err) {
      toast.error(err.mensagem);
    } finally {
      handleLoad(false);
    }
  }

  return (
    <>
      <MainCard
        content={false}
        title="Lista de dados"
        secondary={
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title="Pesquisar">
              <Button
                variant="contained"
                size="small"
                color="primary"
                endIcon={<SearchIcon />}
                onClick={() => setAbrirModalCadastro(!abrirModalCadastro)}
              >
                Pesquisar
              </Button>
            </Tooltip>

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
      <ModalCadastro open={abrirModalCadastro} setOpen={setAbrirModalCadastro} listar={listarCnaes} segmentos={segmentos} cnae={cnae} setCnae={setCnae} />
    </>
  );
};

export default Cnae;
