import React, { useState, useEffect } from 'react';
import { Box, Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Paper, IconButton, LinearProgress, Modal, Button, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Pagination } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { FerramentasDaListagem } from '../../shared/components';
import { Api } from '../../shared/services/api/Index';
import { PDFViewer } from '@react-pdf/renderer';
import { useAuthContext } from '../../shared/contexts';
import FichaMembro from '../../shared/components/reports/Ficha';
import { useNavigate } from 'react-router-dom';

interface MembroData {
  id: number;
  categoria: string;
  comite: string;
  nome: string;
  data_nascimento: string;
  naturalidade: string;
  municipio: string;
  bairro: string;
  bi: string;
  cartao_militante: string;
  cartao_eleitoral: string;
  data_ingresso: string;
  cas: string;
  cap: string;
  profissao: string;
  habilitacao: string;
  ocupacao: string;
  funcao: string;
  telefone: string;
  email: string;
  foto: string;
  outra: string;
}

export const Membro: React.FC = () => {

  const navigate = useNavigate();

  const [membros, setMembros] = useState<MembroData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembro, setSelectedMembro] = useState<MembroData | null>(null);
  const [visualizarFotoOpen, setVisualizarFotoOpen] = useState(false);
  const [fotoURL, setFotoURL] = useState<string>('');
  const [membroParaImprimir, setMembroParaImprimir] = useState<MembroData | null>(null);
  const [pdfKey, setPdfKey] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;
  const { nivelUsuario, municipioUsuario } = useAuthContext();


  const [nome, setNome] = useState('');

  // Carregar Membros, Categorias e Comites
  const carregar = async () => {
    setIsLoading(true);
    try {
      const membrosResponse = await Api.get<MembroData[]>('/membro/');
      if(nivelUsuario == "normal"){
        setMembros(membrosResponse.data.filter(membro=>membro.municipio == municipioUsuario));
      }else{
        setMembros(membrosResponse.data);
      }
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);


  const abrirVisualizarFoto = (url: string, nome: string) => {
    setFotoURL(url);
    setNome(nome);
    setVisualizarFotoOpen(true);
  };

  const fecharVisualizarFoto = () => {
    setVisualizarFotoOpen(false);
  };

  const formatarDataISO = (isoDateString: string) => {
    const data = new Date(isoDateString);
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses vão de 0 a 11
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  const imprimir = (membro: MembroData) => {
      setMembroParaImprimir(membro);
  };

  // Reinicializar chave do PDFViewer quando o modal for fechado
  const handleModalClose = () => {
    setMembroParaImprimir(null);
    setPdfKey(prevKey => prevKey + 1); // Incrementa a chave para forçar recriação do PDFViewer
  };

  const handlePaginaChange = (event: React.ChangeEvent<unknown>, novaPagina: number) => {
    setPaginaAtual(novaPagina);
  };
  
  const membrosPaginados = membros.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );


  return (
    <LayoutBaseDePagina
      titulo='Membros'
    >
      <Box width='100%' display='flex'>
        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Nº</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Nome</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Função</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Foto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Categoria</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Imprimir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membrosPaginados.map((membro, i) => (
                <TableRow key={membro.id}>
                <TableCell align="center">{(paginaAtual - 1) * itensPorPagina + i + 1}</TableCell>
                  <TableCell 
                    sx={{
                      whiteSpace: 'nowrap',
                    }} 
                    align="center">{membro.nome}
                  </TableCell>
                  <TableCell align="center">{membro.funcao}</TableCell>
                  <TableCell align="center" onClick={() => abrirVisualizarFoto(membro.foto, membro.nome)}><Avatar src={membro.foto}/></TableCell>
                  <TableCell align="center">
                    <IconButton color='primary' onClick={() => navigate(`/categoria_membro/${membro.id}/${membro.nome}`)}>
                      <Icon>open_in_new</Icon>
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color='primary' onClick={() => imprimir(membro)}>
                      <Icon>print</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                  <TableCell align="center" colSpan={15}>
                    {isLoading ? (
                      <LinearProgress variant='indeterminate' />
                    ) : (
                      <Pagination
                        count={Math.ceil(membros.length / itensPorPagina)}
                        page={paginaAtual}
                        onChange={handlePaginaChange}
                        color="primary"
                        variant="text"
                        shape="rounded"
                        size='small'
                      />
                    )}
                  </TableCell>
                </TableRow>
              </TableFooter>
          </Table>
        </TableContainer>
      </Box>

      {membroParaImprimir && (
        <Modal open={!!membroParaImprimir} onClose={handleModalClose}>
          <Box sx={{ width: '100%', height: '100%'}}>
            <PDFViewer key={pdfKey} style={{ width: '100%', height: '100%' }}>
              <FichaMembro data={membroParaImprimir} />
            </PDFViewer>
          </Box>
        </Modal>
      )}
      {/* Modal de Visualização da Foto */}
      <Dialog
        open={visualizarFotoOpen}
        onClose={fecharVisualizarFoto}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle><Typography sx={{fontWeight: 'bold'}}>Foto de {nome}</Typography></DialogTitle>
        <DialogContent>
          <img
            src={fotoURL}
            alt="Foto do Membro"
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharVisualizarFoto} color="primary" variant='contained'>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutBaseDePagina>
  );
};
