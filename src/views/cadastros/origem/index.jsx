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
import ModalFiltro from "./ModalFiltro";

// services api
import { listar, inativar } from "../../../services/origem";

const Origem = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [origem, setOrigem] = useState(null);
  const [origens, setOrigens] = useState([]);
  const [datatable, setDatatable] = useState({});
  const [abrirModalCadastro, setAbrirModalCadastro] = useState(false);
  const [abrirModalFiltro, setAbrirModalFiltro] = useState(false);

  useEffect(() => {
    listarOrigens(null, 1);
  }, []);

  useEffect(() => {
    setDatatable({
      columns: [
        { name: '#ID', selector: row => row.codigo_ppo, grow: 0 },
        { name: 'DATA CADASTRO', selector: row => row.datacadastro_ppo },
        { name: 'NOME', selector: row => row.nome_ppo },
        { name: 'OBSERVAÇÃO', selector: row => row.observacao_ppo },
        { name: 'AÇÃO', selector: row => row.acao }
      ],
      rows: origens
        && origens.map(item => ({
          codigo_ppo: item.codigo_ppo,
          datacadastro_ppo: item.datacadastro_ppo,
          nome_ppo: item.nome_ppo,
          observacao_ppo: item.observacao_ppo,
          acao: (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Tooltip placement="top" title="Editar">
                <IconButton color="primary" aria-label="editar" size="large" onClick={() => handleEditar(item)}>
                  <EditIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Remover">
                <IconButton color="secondary" aria-label="editar" size="large" onClick={() => handleRemover(item.codigo_ppo, item.nome_ppo)}>
                  <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }))
    })
  }, [origens]);

  async function listarOrigens(nome, pagina) {
    try {
      handleLoad(true);
      const dados = await listar(user.token, nome, pagina);

      if (dados) {
        setOrigens(dados);
      } else {
        toast.error("Ocorreu um erro ao listar os segmentos do CNAE!");
      }
    } catch (erro) {
      toast.error(erro.message);
    } finally {
      handleLoad(false);
    }
  }

  function handleEditar(data) {
    setOrigem({
      codigo: data.codigo_ppo,
      nome: data.nome_ppo,
      observacao: data.observacao_ppo
    });

    setAbrirModalCadastro(true);
  }

  async function handleRemover(id, nome) {
    try {
      Swal.fire({
        title: "Remover a origem?",
        text: "Remover a origem: " + nome + "?",
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
              "A origem foi removido com sucesso.",
              "success"
            );
            await listarOrigens(null, 1);
          } else {
            Swal.fire(
              "Erro",
              "Erro ao remover a origem.",
              "error"
            );
          }
        } else {
          Swal.fire(
            "Operação Cancelada",
            "A origem não foi removido.",
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
                onClick={() => setAbrirModalFiltro(!abrirModalFiltro)}
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

      <ModalCadastro open={abrirModalCadastro} setOpen={setAbrirModalCadastro} listar={listarOrigens} origem={origem} setOrigem={setOrigem} />
      <ModalFiltro open={abrirModalFiltro} setOpen={setAbrirModalFiltro} listar={listarOrigens} />
    </>
  );
};

export default Origem;
