import { useState, useEffect } from 'react';

// material-ui
import { Button, Stack, Tooltip, IconButton } from '@mui/material';

// assets
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
import { listar, listarSistemas, removerConfiguracao } from "../../../services/configuracaoMailing";

const ConfiguracaoMailing = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { handleLoad } = useLoad();

  const [configuracoes, setConfiguracoes] = useState([]);
  const [configuracao, setConfiguracao] = useState(null);
  const [sistemas, setSistemas] = useState([]);
  const [datatable, setDatatable] = useState({});
  const [abrirModalCadastro, setAbrirModalCadastro] = useState(false);

  useEffect(() => {
    listarConfiguracoes();
  }, []);

  useEffect(() => {
    setDatatable({
      columns: [
        { name: '#ID', selector: row => row.codigo_mcf, grow: 0 },
        { name: 'SISTEMA', selector: row => row.nome_sis },
        { name: 'QTDE. REGISTROS', selector: row => row.qtderegistro_mcf },
        { name: 'LIMITE DE SOLICITAÇÃO', selector: row => row.limitesolicitacao_mcf },
        { name: 'AÇÃO', selector: row => row.acao }
      ],
      rows: configuracoes
        && configuracoes.map(item => ({
          codigo_mcf: item.codigo_mcf,
          nome_sis: item.nome_sis,
          qtderegistro_mcf: item.qtderegistro_mcf,
          limitesolicitacao_mcf: item.limitesolicitacao_mcf,
          acao: (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Tooltip placement="top" title="Editar">
                <IconButton color="primary" aria-label="editar" size="large" onClick={() => handleEditar(item)}>
                  <EditIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip placement="top" title="Remover">
                <IconButton color="secondary" aria-label="editar" size="large" onClick={() => handleRemover(item.codigo_mcf)}>
                  <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )
        }))
    })
  }, [configuracoes]);

  async function listarConfiguracoes() {
    try {
      handleLoad(true);
      const dados = await listar(user.token);
      if (dados) {
        setConfiguracoes(dados);
        await buscarSistemas(dados);
      } else {
        toast.error("Ocorreu um erro ao listar os CNAE!");
      }
    } catch (erro) {
      toast.error(erro.message);
    } finally {
      handleLoad(false);
    }
  }

  async function buscarSistemas(configs) {
    try {
      const response = await listarSistemas(user.token);
      if (response) {
        let configCriada = [];
        let auxSistemas = [];

        configs?.map(c => {
          configCriada.push(c.codigo_sis);
        })

        response?.map(item => {
          if (!configCriada.includes(item.value)) {
            auxSistemas.push(item);
          }
        })

        setSistemas(auxSistemas);
      } else {
        toast.error("Ocorreu um erro ao listar os sistemas.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handleEditar(data) {
    setConfiguracao({
      codigo_mcf: data.codigo_mcf,
      codigo_sis: data.codigo_sis,
      nome_sis: data.nome_sis,
      qtderegistro_mcf: data.qtderegistro_mcf,
      limitesolicitacao_mcf: data.limitesolicitacao_mcf,
      perctnovo_mcf: data.perctnovo_mcf,
      perctliberacao_mcf: data.perctliberacao_mcf,
      prazomin_mcf: data.prazomin_mcf,
      prazomax_mcf: data.prazomax_mcf,
    });

    setAbrirModalCadastro(true);
  }

  async function handleRemover(id) {
    try {
      Swal.fire({
        title: "Remover configuração?",
        text: "Caso confirmado, a configuração será removida.",
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
          const result = await removerConfiguracao(user.token, id);
          if (result.retorno) {
            Swal.fire("Sucesso", "Configuração removida com sucesso 😁", "success");
            await listarConfiguracoes();
          } else {
            Swal.fire("Erro", "Erro ao remover a configuração, tente novamente 🤯", "error");
          }
        } else {
          Swal.fire(
            "Operação Cancelada",
            "A Configuração não foi removida.",
            "info"
          );
        }

        handleLoad(false);
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

      <ModalCadastro open={abrirModalCadastro} setOpen={setAbrirModalCadastro} listar={listarConfiguracoes} sistemas={sistemas} configuracao={configuracao} setConfiguracao={setConfiguracao} />
    </>
  );
};

export default ConfiguracaoMailing;
