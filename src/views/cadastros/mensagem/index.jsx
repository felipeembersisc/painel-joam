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
import { listar, inativar } from "../../../services/mensagem";
import { listarProdutos } from "../../../services/produto";

// helpers
import funcoes from "../../../utils/helpers/funcoes";

const Mensagem = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [mensagens, setMensagens] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [datatable, setDatatable] = useState({});
  const [abrirModalCadastro, setAbrirModalCadastro] = useState(false);
  const [abrirModalFiltro, setAbrirModalFiltro] = useState(false);

  useEffect(() => {
    listarMensagens(null, null, null);
    buscarProdutos();
  }, []);

  useEffect(() => {
    setDatatable({
      columns: [
        { name: '#ID', selector: row => row.codigo_men, grow: 0 },
        { name: 'PRODUTO', selector: row => row.nome_pro },
        { name: 'TÍTULO', selector: row => row.titulo_men },
        { name: 'TEXTO', selector: row => row.texto_men },
        { name: 'AÇÃO', selector: row => row.acao }
      ],
      rows: mensagens
        && mensagens.map(item => ({
          codigo_men: item.codigo_men,
          nome_pro: item.nome_pro,
          titulo_men: item.titulo_men,
          texto_men: (
            <Tooltip
              placement="top"
              title={item.texto_men}
            >
              <p>{funcoes.limitarTexto(item.texto_men, 100)}</p>
            </Tooltip>
          ),
          acao: (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Tooltip placement="top" title="Editar">
                <IconButton color="primary" aria-label="editar" size="large" onClick={() => handleEditar(item)}>
                  <EditIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Remover">
                <IconButton color="secondary" aria-label="editar" size="large" onClick={() => handleRemover(item.codigo_men, item.titulo_men)}>
                  <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }))
    })
  }, [mensagens]);

  async function listarMensagens(codigo_pro, titulo_men, texto_men) {
    try {
      handleLoad(true);
      const dados = await listar(user.token, codigo_pro, titulo_men, texto_men);

      if (dados) {
        setMensagens(dados);
      } else {
        toast.error("Ocorreu um erro ao listar as mensagens!");
      }
    } catch (erro) {
      toast.error(erro.message);
    } finally {
      handleLoad(false);
    }
  }

  async function buscarProdutos() {
    try {
      const response = await listarProdutos(user.token);
      if (response) {
        setProdutos(response);
      } else {
        toast.error("Ocorreu um erro ao listar os produtos.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handleEditar(data) {
    console.log(data)
    setMensagem({
      codigo_men: data.codigo_men,
      codigo_pro: data.codigo_pro ? parseInt(data.codigo_pro) : null,
      titulo_men: data.titulo_men,
      texto_men: data.texto_men
    });
    setAbrirModalCadastro(true);
  }

  async function handleRemover(id, nome) {
    try {
      Swal.fire({
        title: "Remover a mensagem?",
        text: "Remover a mensagem: " + nome + "?",
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
              "A mensagem foi removido com sucesso.",
              "success"
            );
            await listarMensagens(null, null, null);
          } else {
            Swal.fire(
              "Erro",
              "Erro ao remover a mensagem.",
              "error"
            );
          }
        } else {
          Swal.fire(
            "Operação Cancelada",
            "A mensagem não foi removido.",
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

      <ModalCadastro open={abrirModalCadastro} setOpen={setAbrirModalCadastro} listar={listarMensagens} produtos={produtos} mensagem={mensagem} setMensagem={setMensagem} />
      <ModalFiltro open={abrirModalFiltro} setOpen={setAbrirModalFiltro} listar={listarMensagens} produtos={produtos} />
    </>
  );
};

export default Mensagem;
