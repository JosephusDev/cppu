import React, { useState, useEffect, useRef } from 'react';
import { Box, Icon, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, Paper, IconButton, LinearProgress } from '@mui/material';
import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { Api } from '../../shared/services/api/Index';
import { useAuthContext } from '../../shared/contexts';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

interface categoriaData {
  id: number;
  categoria: string;
}

interface categoriaPorMembroData {
  id: number;
  id_membro: number;
  categoria: string;
}

export const CategoriaMembro: React.FC = () => {

  const { id, nome } = useParams<{ id: string; nome: string }>();

  const notify = () => toast.success('Efectuado com sucesso!', { autoClose: 2000, position: 'bottom-right' });
  
  const [categorias, setCategorias] = useState<categoriaData[]>([]);
  const [categoriasMembro, setCategoriasMembro] = useState<categoriaPorMembroData[]>([]);
  const [nomecategoria, setNomeCategoria] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const { nivelUsuario } = useAuthContext();

  const carregar = () => {
    Api.get<categoriaData[]>(`/categoria`)
    .then(response => {
      setCategorias(response.data);
    })
    .catch(error => {
      console.error('Erro ao buscar os categorias:', error);
    })
    .finally(() => setIsLoading(false));
  }

  const carregarCategoriasMembro = () => {
    Api.get<categoriaPorMembroData[]>(`/categoriapormembro/membro/${id}`)
    .then(response => {
      setCategoriasMembro(response.data);
    })
    .catch(error => {
      console.error('Erro ao buscar os categorias do membro:', error);
    })
    .finally(() => setIsLoading(false));
  }

  const cadastrar = () => {
    if(nomecategoria){
      setIsLoading(true);
      Api.post(`/categoriapormembro/`, { id_membro: id, categoria: nomecategoria })
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
    Api.delete(`/categoriapormembro/${id}`)
   .then(notify)
   .catch(error => console.log(error))
   .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    carregarCategoriasMembro();
  }, [categoriasMembro]);

  return (
    <LayoutBaseDePagina
      titulo={`${nome} - Categorias`}
      barraDeFerramentas={
        <FerramentasDaListagem 
          mostrarCampos={true}
          aoClicarEmNovo={cadastrar}
          textoBotao='Nova'
        >
          <Select
            value={nomecategoria}
            onChange={e => setNomeCategoria(e.target.value)}
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
              {categoriasMembro.map((categoria, i) => (
                <TableRow key={categoria.id}>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell align="center">{categoria.categoria}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => {
                      nivelUsuario === 'admin' && eliminar(categoria.id)
                    }} 
                      color="primary"
                    >
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
