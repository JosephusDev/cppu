import React, { useState, useEffect, useRef } from 'react';
import { Box, Icon, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Paper, IconButton, LinearProgress, Typography, Avatar, TextField, useMediaQuery, Theme, useTheme } from '@mui/material';
import { FerramentasDaListagem, MyModal } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Api } from '../../shared/services/api/Index';
import { toast } from 'react-toastify';

interface utilizadorData {
  id: number;
  nome: string;
  usuario: string;
  senha: string;
  nivel: string;
  municipio: string;
}

export const Utilizadores: React.FC = () => {

  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const theme = useTheme();

  const notify = () => toast.success('Efectuado com sucesso!', { autoClose: 2000, position: 'bottom-right' });
  
  const [utilizadores, setUtilizadores] = useState<utilizadorData[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [nivel, setNivel] = useState("")
  const [municipio, setMunicipio] = useState("")
  const [modalOpen, setModalOpen] = useState(false);


  const carregar = () => {
    setIsLoading(true);
    Api.get<utilizadorData[]>(`/auth/`)
    .then(response => {
      setUtilizadores(response.data);
    })
    .catch(error => {
      console.error('Erro ao buscar os utilizadores:', error);
    })
    .finally(() => setIsLoading(false));
  }

  const cadastrar = () => {
    if(nome.trim() || usuario.trim() || senha.trim() || nivel.trim() || municipio.trim()) {
      setIsLoading(true);
      Api.post(`/auth/cadastrar`, { 
        nome: nome,
        login: usuario,
        senha: senha,
        tipo: nivel,
        municipio: municipio,
      })
     .then(notify)
     .catch(error => console.log(error))
     .finally(() => {
      setIsLoading(false)
      setModalOpen(false);
     })
    }else{
      toast.error('Preencha os campos', { autoClose: 2000, position: 'bottom-right' });
    }
  }

  const eliminar = (id: Number) => {
    setIsLoading(true);
    Api.delete(`/auth/${id}`)
   .then(notify)
   .catch(error => console.log(error))
   .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    carregar();
  }, [utilizadores]);

  return (
    <LayoutBaseDePagina
      titulo='Utilizadores'
      barraDeFerramentas={
        <FerramentasDaListagem 
          aoClicarEmNovo={()=>setModalOpen(true)}
          textoBotao='Novo'
        />
      }
    >
      <Box width='100%' display='flex'>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Nº
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Nome
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Usuario
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Nivel
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Município
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Eliminar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {utilizadores.map((utilizador, i) => (
                <TableRow key={utilizador.id}>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="center">{utilizador.nome}</TableCell>
                  <TableCell align="center">{utilizador.usuario}</TableCell>
                  <TableCell align="center">{utilizador.nivel}</TableCell>
                  <TableCell align="center">{utilizador.municipio}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => eliminar(utilizador.id)} color="primary">
                      <Icon>delete</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <MyModal titulo='Cadastrar Utilizador' open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box width='100%' borderRadius={4}>
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '50%'}} label='Nome' value={nome} onChange={e => setNome(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '50%'}} label='Usuario' value={usuario} onChange={e => setUsuario(e.target.value)} margin='normal' />
          <TextField InputLabelProps={{ shrink: true }} sx={{width: smDown ? '100%' : '30%'}} label='Senha' type='password' value={senha} onChange={e => setSenha(e.target.value)} margin='normal' />
          <Select
            value={nivel}
            onChange={e => setNivel(e.target.value)}
            displayEmpty
            sx={{marginTop: 2, width: smDown ? '100%' : '30%'}}
          >
            <MenuItem value='' disabled>Selecionar Nível</MenuItem>
            <MenuItem key={0} value={'admin'}>Administrador</MenuItem>
            <MenuItem key={1} value={'normal'}>Normal</MenuItem>
          </Select>     
          <Select
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
            displayEmpty
            sx={{marginTop: 2, width: smDown ? '100%' : '30%'}}
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
          <Box display='flex' justifyContent='end' mt={2}>
            <Button onClick={() => setModalOpen(false)} variant='contained' color='secondary'>
              Cancelar
            </Button>&nbsp;
            <Button onClick={cadastrar} variant='contained' color='primary'>
              Cadastrar
            </Button>&nbsp;
          </Box>
        </Box>
      </MyModal>
    </LayoutBaseDePagina>
  );
};
