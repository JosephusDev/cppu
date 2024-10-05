import React, { useState, useEffect, useRef } from 'react';
import { Box, Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Paper, IconButton, LinearProgress, Modal, TextField, Button, Select, MenuItem, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { FerramentasDaListagem, MyModal} from '../../shared/components';
import { useParams } from 'react-router-dom';
import { Api } from '../../shared/services/api/Index';
import { PDFViewer } from '@react-pdf/renderer';
import ListaPorGrupo from '../../shared/components/reports/ListaPorGrupo';
import FichaMembro from '../../shared/components/reports/Ficha';

interface MembroData {
  id: number;
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

interface categoriaData {
  id: number;
  categoria: string;
}


export const MembroPorGrupos: React.FC = () => {

    const { id, tipo, title } = useParams<{ id: string; tipo: string; title: string }>();
    const [membros, setMembros] = useState<MembroData[]>([]);
    const [categorias, setCategorias] = useState<categoriaData[]>([]);
    const [visualizarFotoOpen, setVisualizarFotoOpen] = useState(false);
    const [fotoURL, setFotoURL] = useState<string>('');
    const [membroParaImprimir, setMembroParaImprimir] = useState<MembroData | null>(null);
    const [listaParaImprimir, setListaParaImprimir] = useState<MembroData[] | null>(null);
    const [pdfKey, setPdfKey] = useState(0);
    const [municipio, setMunicipio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [_id, set_Id] = useState(id);
    const [_title, set_Title] = useState(title);


    const abrirVisualizarFoto = (url: string) => {
        setFotoURL(url);
        setVisualizarFotoOpen(true);
    };

    const fecharVisualizarFoto = () => {
        setVisualizarFotoOpen(false);
    };

    const imprimir = (membro: MembroData) => {
        setMembroParaImprimir(membro);
    };
    
    const imprimirTodos = () => {
        setListaParaImprimir(filteredMembros);
    };

    // Reinicializar chave do PDFViewer quando o modal for fechado
    const handleModalClose = () => {
        setMembroParaImprimir(null);
        setListaParaImprimir(null);
        setPdfKey(prevKey => prevKey + 1); // Incrementa a chave para forçar recriação do PDFViewer
    };

    useEffect(() => {
      Api.get<categoriaData[]>(`/categoria/municipais`)
      .then(response => {
        setCategorias(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar os categorias:', error);
      })
    }, []);

    useEffect(() => {
        if(tipo == "categoria"){
            Api.get(`/categoriapormembro/${_id}`)
            .then(response => {
               setMembros(response.data);
             })
            .catch(error => {
               console.error('Erro ao carregar membros:', error);
             });
        }
    }, [_id])

    const filteredMembros = municipio ? membros.filter(membro => membro.municipio === municipio) : membros


  return (
    <LayoutBaseDePagina
      titulo={`${_title}`}
      barraDeFerramentas={
        <FerramentasDaListagem 
          aoClicarEmNovo={imprimirTodos}
          textoBotao='Imprimir'
          iconButton='print'
          mostrarCampos={true}
        >
          <Select
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
            displayEmpty
            fullWidth
            size="small"
          >
            <MenuItem key={0} value=''>Pesquisar por Município</MenuItem>
            <MenuItem key={1} value={"Alto Cauale"}>{"Alto Cauale"}</MenuItem>
            <MenuItem key={2} value={"Ambuila"}>{"Ambuila"}</MenuItem>
            <MenuItem key={3} value={"Bembe"}>{"Bembe"}</MenuItem>
            <MenuItem key={4} value={"Buengas"}>{"Buengas"}</MenuItem>
            <MenuItem key={4} value={"Bungo"}>{"Bungo"}</MenuItem>
            <MenuItem key={5} value={"Damba"}>{"Damba"}</MenuItem>
            <MenuItem key={15} value={"Maquela do Zombo"}>{"Maquela do Zombo"}</MenuItem>
            <MenuItem key={6} value={"Milunga"}>{"Milunga"}</MenuItem>
            <MenuItem key={7} value={"Mucaba"}>{"Mucaba"}</MenuItem>
            <MenuItem key={8} value={"Negage"}>{"Negage"}</MenuItem>
            <MenuItem key={9} value={"Puri"}>{"Puri"}</MenuItem>
            <MenuItem key={10} value={"Quimbele"}>{"Quimbele"}</MenuItem>
            <MenuItem key={11} value={"Quitexe"}>{"Quitexe"}</MenuItem>
            <MenuItem key={12} value={"Sanza Pombo"}>{"Sanza Pombo"}</MenuItem>
            <MenuItem key={13} value={"Songo"}>{"Songo"}</MenuItem>
            <MenuItem key={14} value={"Uíge"}>{"Uíge"}</MenuItem>
          </Select>
          {
            title === 'CMP-MPLA' &&           
            <Select
              value={categoria}
              onChange={e => {
                set_Title(e.target.value)
                setCategoria(e.target.value)
                const selectedCategoria = categorias.find(cat => cat.categoria == e.target.value)
                set_Id(selectedCategoria ? selectedCategoria.id.toString() : id)
              }}
              displayEmpty
              fullWidth
              size="small"
            >
              <MenuItem value='' disabled>Selecionar categoria</MenuItem>
              {categorias.map(categoria => (
                <MenuItem key={categoria.id} value={categoria.categoria}>
                  {categoria.categoria}
                </MenuItem>
              ))}
            </Select>
          }
        </FerramentasDaListagem>
        
      }
    >
      <Box width='100%' display='flex'>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Nº</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Nome</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>CAP</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Cartão militente</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Função</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Foto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Imprimir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembros.map((membro, i) => (
                <TableRow key={membro.id}>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="center">{membro.nome}</TableCell>
                  <TableCell align="center">{membro.cap}</TableCell>
                  <TableCell align="center">{membro.cartao_militante}</TableCell>
                  <TableCell align="center">{membro.funcao}</TableCell>
                  <TableCell align="center" onClick={() => abrirVisualizarFoto(`http://localhost:8800${membro.foto}`)}><Avatar src={`http://localhost:8800${membro.foto}`}/></TableCell>
                  <TableCell align="center">
                    <IconButton color='primary' onClick={() => imprimir(membro)}>
                      <Icon>print</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Modal para o PDFViewer */}
      {membroParaImprimir && (
        <Modal open={!!membroParaImprimir} onClose={handleModalClose}>
          <Box sx={{ width: '100%', height: '100%', marginBottom: '5%' }}>
            <PDFViewer key={pdfKey} style={{ width: '100%', height: '100%' }}>
              <FichaMembro data={membroParaImprimir} />
            </PDFViewer>
          </Box>
        </Modal>
      )}
      {listaParaImprimir && (
        <Modal open={!!listaParaImprimir} onClose={handleModalClose}>
          <Box sx={{ width: '100%', height: '100%', marginBottom: '5%' }}>
            <PDFViewer key={pdfKey} style={{ width: '100%', height: '100%' }}>
              <ListaPorGrupo data={listaParaImprimir} grupo={_title || ''} municipio={municipio} />
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
        <DialogTitle><Typography sx={{fontWeight: 'bold'}}>Foto de membro</Typography></DialogTitle>
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
