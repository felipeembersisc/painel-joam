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
import { listar, inativar } from "../../../services/segmentoCnae";

const SegmentoCnae = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [segmentoCnae, setSegmentoCnae] = useState(null);
  const [segmentosCnae, setSegmentosCnae] = useState([]);
  const [datatable, setDatatable] = useState({});
  const [abrirModalCadastro, setAbrirModalCadastro] = useState(false);
  const [abrirModalFiltro, setAbrirModalFiltro] = useState(false);

  useEffect(() => {
    listarSegmentosCnae(null, null, null, 1);
  }, []);

  useEffect(() => {
    setDatatable({
      columns: [
        { name: '#ID', selector: row => row.codigo_sgc, grow: 0 },
        { name: 'DATA CADASTRO', selector: row => row.datacadastro_sgc },
        { name: 'NOME', selector: row => row.nome_sgc },
        { name: 'DIV. INICIAL', selector: row => row.divisaoinicial_sgc },
        { name: 'DIV. FINAL', selector: row => row.divisaofinal_sgc },
        { name: 'AÇÃO', selector: row => row.acao }
      ],
      rows: segmentosCnae
        && segmentosCnae.map(item => ({
          codigo_sgc: item.codigo_sgc,
          datacadastro_sgc: item.datacadastro_sgc,
          nome_sgc: item.nome_sgc,
          divisaoinicial_sgc: item.divisaoinicial_sgc,
          divisaofinal_sgc: item.divisaofinal_sgc,
          acao: (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Tooltip placement="top" title="Editar">
                <IconButton color="primary" aria-label="editar" size="large" onClick={() => handleEditar(item)}>
                  <EditIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Remover">
                <IconButton color="secondary" aria-label="editar" size="large" onClick={() => handleRemover(item.codigo_sgc, item.nome_sgc)}>
                  <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }))
    })
  }, [segmentosCnae]);

  async function listarSegmentosCnae(
    divisaoInicial,
    divisaoFinal,
    nome,
    pagina
  ) {
    try {
      handleLoad(true);
      const dados = await listar(user.token, divisaoInicial, divisaoFinal, nome, pagina);

      if (dados) {
        setSegmentosCnae(dados);
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
    setSegmentoCnae({
      codigo_sgc: data.codigo_sgc,
      nome_sgc: data.nome_sgc,
      secao_sgc: data.secao_sgc,
      divisaoinicial_sgc: data.divisaoinicial_sgc,
      divisaofinal_sgc: data.divisaofinal_sgc

    });
    setAbrirModalCadastro(true);
  }

  async function handleRemover(id, nome) {
    try {
      Swal.fire({
        title: "Remover o segmento?",
        text: "Remover o segmento: " + nome + "?",
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
              "O segmento foi removido com sucesso.",
              "success"
            );
            await listarSegmentosCnae(null, null, null, 1);
          } else {
            Swal.fire(
              "Erro",
              "Erro ao remover o segmento.",
              "error"
            );
          }
        } else {
          Swal.fire(
            "Operação Cancelada",
            "O segmento não foi removido.",
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

      <ModalCadastro open={abrirModalCadastro} setOpen={setAbrirModalCadastro} listar={listarSegmentosCnae} segmentoCnae={segmentoCnae} setSegmentoCnae={setSegmentoCnae} />
      <ModalFiltro open={abrirModalFiltro} setOpen={setAbrirModalFiltro} listar={listarSegmentosCnae} />
    </>
  );
};

export default SegmentoCnae;
