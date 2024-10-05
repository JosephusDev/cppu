import React, { useState, useEffect, useRef } from 'react';
import { Box, Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Paper, IconButton, LinearProgress, Modal, TextField, Button, Select, MenuItem, Typography, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Pagination, useMediaQuery, Theme, useTheme } from '@mui/material';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { FerramentasDaListagem, MyModal} from '../../shared/components';
import { Api } from '../../shared/services/api/Index';
import { toast } from 'react-toastify';
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

  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const theme = useTheme();

  const navigate = useNavigate();

  const notify = () => toast.success('Efectuado com sucesso!', { autoClose: 2000, position: 'bottom-right' });

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
  const [bi, setBi] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [funcao, setFuncao] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const [categoria, setCategoria] = useState('');
  const [comite, setComite] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [cartaoMilitante, setCartaoMilitante] = useState('');
  const [cartaoEleitoral, setCartaoEleitoral] = useState('');
  const [dataIngresso, setDataIngresso] = useState('');
  const [cas, setCas] = useState('');
  const [cap, setCap] = useState('');
  const [profissao, setProfissao] = useState('');
  const [habilitacao, setHabilitacao] = useState('');
  const [ocupacao, setOcupacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [outra, setOutra] = useState('');
  const [textoFoto, setTextoFoto] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const cadastrar = () => {
    if (nome.trim() && bi.trim() && municipio.trim() && funcao.trim()) {
      setModalOpen(false);
      setIsLoading(true);
      const formData = new FormData();

      formData.append('nome', nome);
      formData.append('bi', bi);
      formData.append('municipio', municipio);
      formData.append('funcao', funcao);
      if (foto) {
        formData.append('foto', foto);
      }
      formData.append('categoria', categoria);
      formData.append('comite', comite);
      formData.append('data_nascimento', dataNascimento);
      formData.append('naturalidade', naturalidade);
      formData.append('bairro', bairro);
      formData.append('cartao_militante', cartaoMilitante);
      formData.append('cartao_eleitoral', cartaoEleitoral);
      formData.append('data_ingresso', dataIngresso);
      formData.append('cas', cas);
      formData.append('cap', cap);
      formData.append('profissao', profissao);
      formData.append('habilitacao', habilitacao);
      formData.append('ocupacao', ocupacao);
      formData.append('telefone', telefone);
      formData.append('email', email);
      formData.append('outra', outra);

      Api.post('/membro/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res)=>{
          console.log(res);
          notify();
        })
        .catch(error => console.log(error))
        .finally(() => {
          setIsLoading(false);
          carregar();
          limparCampos();
        });
    } else {
      toast.error('Preencha os campos obrigatórios', { autoClose: 2000, position: 'bottom-right' });
    }
  };

  const eliminar = (id: number) => {
    setIsLoading(true);
    Api.delete(`/membro/${id}`)
      .then(notify)
      .catch(error => console.log(error))
      .finally(() => {
        setIsLoading(false);
        carregar();
      });
  };

  const editar = () => {
    if(nivelUsuario === 'admin'){
      if (selectedMembro) {
        setModalOpen(false);
        setIsLoading(true);
        const formData = new FormData();
  
        formData.append('nome', nome);
        formData.append('bi', bi);
        formData.append('municipio', municipio);
        formData.append('funcao', funcao);
        if (foto) {
          formData.append('foto', foto);
        }
        formData.append('categoria', categoria);
        formData.append('comite', comite);
        formData.append('data_nascimento', dataNascimento);
        formData.append('naturalidade', naturalidade);
        formData.append('bairro', bairro);
        formData.append('cartao_militante', cartaoMilitante);
        formData.append('cartao_eleitoral', cartaoEleitoral);
        formData.append('data_ingresso', dataIngresso);
        formData.append('cas', cas);
        formData.append('cap', cap);
        formData.append('profissao', profissao);
        formData.append('habilitacao', habilitacao);
        formData.append('ocupacao', ocupacao);
        formData.append('telefone', telefone);
        formData.append('email', email);
        formData.append('outra', outra);
  
        Api.put(`/membro/${selectedMembro.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(notify)
          .catch(error => console.log(error))
          .finally(() => {
            setIsLoading(false);
            carregar();
            limparCampos();
          });
      }
    }    
  };


  useEffect(() => {
    carregar();
  }, []);

  const abrirModal = (membro: MembroData) => {
    setSelectedMembro(membro);
    setNome(membro.nome);
    setBi(membro.bi);
    setMunicipio(membro.municipio);
    setTextoFoto(membro.foto);
    setFoto(null);
    setFuncao(membro.funcao);
    setCategoria(membro.categoria);
    setComite(membro.comite);
    setDataNascimento(formatarDataISO(membro.data_nascimento));
    setNaturalidade(membro.naturalidade);
    setBairro(membro.bairro);
    setCartaoMilitante(membro.cartao_militante);
    setCartaoEleitoral(membro.cartao_eleitoral);
    setDataIngresso(formatarDataISO(membro.data_ingresso));
    setCas(membro.cas);
    setCap(membro.cap);
    setProfissao(membro.profissao);
    setHabilitacao(membro.habilitacao);
    setOcupacao(membro.ocupacao);
    setTelefone(membro.telefone);
    setEmail(membro.email);
    setOutra(membro.outra);
    setModalOpen(true);
  };

  const limparCampos = () => {
    setNome('');
    setBi('');
    setMunicipio('');
    setFuncao('');
    setFoto(null);
    setTextoFoto('');
    setCategoria('');
    setComite('');
    setDataNascimento('');
    setNaturalidade('');
    setBairro('');
    setCartaoMilitante('');
    setCartaoEleitoral('');
    setDataIngresso('');
    setCas('');
    setCap('');
    setProfissao('');
    setHabilitacao('');
    setOcupacao('');
    setTelefone('');
    setEmail('');
    setOutra('');
    setSelectedMembro(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFoto(event.target.files[0]);
      setTextoFoto(event.target.files[0].name);
    }
  };

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
      barraDeFerramentas={
        <FerramentasDaListagem 
          aoClicarEmNovo={() => {
            setSelectedMembro(null)
            limparCampos();
            setModalOpen(true)
          }}
        />
      }
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
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>Eliminar</TableCell>
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
                    <IconButton color='primary' onClick={() => {
                      nivelUsuario === 'admin' && eliminar(membro.id)
                    }}>
                      <Icon>delete</Icon>
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

      <MyModal titulo={selectedMembro ? 'Editar Membro' : 'Cadastrar Membro'} open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box 
          width='100%' 
          borderRadius={1}
          sx={{
            maxHeight: smDown ? '60vh' : '100vh', 
            overflowY: 'auto',
          }}
        >
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Nome' value={nome} onChange={e => setNome(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='BI' value={bi} onChange={e => setBi(e.target.value.toUpperCase())} margin='normal' />
          <Select
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
            displayEmpty
            sx={{marginTop: 2, width: smDown ? '100%' : '25%'}}
          >
            <MenuItem value='' disabled>Selecionar Município</MenuItem>
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
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Função' value={funcao} onChange={e => setFuncao(e.target.value)} margin='normal' />

            <TextField
              label="Foto"
              value={textoFoto}
              sx={{width: smDown ? '80%' : '20%', marginTop: 2}}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <IconButton
              color='primary'
              onClick={handleButtonClick}
              sx={{ width: smDown ? '20%' : '5%', marginTop: 2 }}
            >
              <Icon fontSize='large'>upload_file</Icon>
            </IconButton>
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} type='date' label='Data de Nascimento' value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Naturalidade' value={naturalidade} onChange={e => setNaturalidade(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Bairro' value={bairro} onChange={e => setBairro(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Cartão de Militante' value={cartaoMilitante} onChange={e => setCartaoMilitante(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Cartão Eleitoral' value={cartaoEleitoral} onChange={e => setCartaoEleitoral(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} type='date' label='Data de Ingresso' value={dataIngresso} onChange={e => setDataIngresso(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='CAS' value={cas} onChange={e => setCas(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='CAP' value={cap} onChange={e => setCap(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Profissão' value={profissao} onChange={e => setProfissao(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Habilitação' value={habilitacao} onChange={e => setHabilitacao(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Ocupação' value={ocupacao} onChange={e => setOcupacao(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Telefone' type='number' value={telefone} onChange={e => setTelefone(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '25%'}} label='Email' value={email} onChange={e => setEmail(e.target.value)} margin='normal' />
          
          <Box display='flex' justifyContent='end' mt={2}>
            <Button onClick={() => setModalOpen(false)} variant='contained' color='secondary'>
              Cancelar
            </Button>&nbsp;
            <Button onClick={selectedMembro ? editar : cadastrar} variant='contained' color='primary'>
              {selectedMembro ? 'Editar' : 'Cadastrar'}
            </Button>&nbsp;
          </Box>
        </Box>
      </MyModal>
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
