import React, { useState, useEffect, useRef } from 'react';
import { Box, Icon, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Paper, IconButton, LinearProgress, Typography, TextField } from '@mui/material';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Api } from '../../shared/services/api/Index';
import { toast } from 'react-toastify';

interface categoriaData {
  id: number;
  categoria: string;
}

export const Categoria: React.FC = () => {

  const notify = () => toast.success('Efectuado com sucesso!', { autoClose: 2000, position: 'bottom-right' });
  
  const [categorias, setCategorias] = useState<categoriaData[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [nomecategoria, setNomecategoria] = useState("")

  const carregar = () => {
    Api.get<categoriaData[]>(`/categoria/`)
    .then(response => {
      setCategorias(response.data);
    })
    .catch(error => {
      console.error('Erro ao buscar os categorias:', error);
    })
    .finally(() => setIsLoading(false));
  }

  const cadastrar = () => {
    if(nomecategoria.trim()){
      const _nomeCategoria = nomecategoria.replace(/\//g, '-')
      setIsLoading(true);
      Api.post(`/categoria/`, { categoria: _nomeCategoria })
     .then(notify)
     .catch(error => console.log(error))
     .finally(() => {
      setIsLoading(false)
     })
    }else{
      toast.error('Preencha os campos', { autoClose: 2000, position: 'bottom-right' });
    }
  }

  const eliminar = (id: Number) => {
    setIsLoading(true);
    Api.delete(`/categoria/${id}`)
   .then(notify)
   .catch(error => console.log(error))
   .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    carregar();
  }, [categorias]);

  return (
    <LayoutBaseDePagina
      titulo='Categorias'
      barraDeFerramentas={
        <FerramentasDaListagem 
          mostrarCampos={true}
          aoClicarEmNovo={cadastrar}
          textoBotao='Nova'
        >
          <TextField 
            label='Nome da categoria'
            fullWidth
            onChange={(e)=>setNomecategoria(e.target.value)}
            value={nomecategoria}
            size="small"
          />
        </FerramentasDaListagem>
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
                  Categoria
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1 }}>
                  Eliminar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categorias.map((categoria, i) => (
                <TableRow key={categoria.id}>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="center">{categoria.categoria}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => eliminar(categoria.id)} color="primary">
                      <Icon>delete</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              {isLoading && (
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    <LinearProgress variant="indeterminate" />
                  </TableCell>
                </TableRow>
              )}
            </TableFooter>
          </Table>
        </TableContainer>

      </Box>
    </LayoutBaseDePagina>
  );
};
