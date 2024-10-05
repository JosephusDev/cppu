import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Categoria,
  HomeScreen,
  Membro,
  Utilizadores,
  MembroPorGrupos,
  CategoriaMembro,
  Sync
} from '../pages';

import { useAuthContext } from '../shared/contexts/AuthContext';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();
  const { nivelUsuario } = useAuthContext();

  useEffect(() => {
    if (nivelUsuario == "admin") {
      setDrawerOptions([
        {
          icon: 'home',
          path: '/home',
          label: 'Home',
        },
        {
          icon: 'people',
          path: '/membros',
          label: 'Membros',
        },
        {
          icon: 'style',
          path: '/categorias',
          label: 'Categorias',
        },
        {
          icon: 'people',
          path: '/utilizadores',
          label: 'Utilizadores',
        },
        {
          icon: 'sync',
          path: '/sync',
          label: 'Sincronização',
        }
      ]);
    }else{
      setDrawerOptions([
        {
          icon: 'home',
          path: '/home',
          label: 'Home',
        },
        {
          icon: 'people',
          path: '/membros',
          label: 'Membros',
        }
      ]);
    }
  }, [nivelUsuario]);

  const rotasAdmin = () => {
    return (
      <Routes>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/membros" element={<Membro />} />
        <Route path="/categorias" element={<Categoria />} />
        <Route path="/sync" element={<Sync />} />
        <Route path="/utilizadores" element={<Utilizadores />} />
        <Route path="/membrosporgrupos/:id/:tipo/:title" element={<MembroPorGrupos/>} />
        <Route path="/categoria_membro/:id/:nome" element={<CategoriaMembro/>} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    );
  }

  const rotasUsuario = () => {
    return (
      <Routes>
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/membros" element={<Membro />} />
        <Route path="/membrosporgrupos/:id/:tipo/:title" element={<MembroPorGrupos/>} />
        <Route path="/categoria_membro/:id/:nome" element={<CategoriaMembro/>} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    );
  }

  return(
    nivelUsuario == "admin" ? rotasAdmin() : rotasUsuario()
  )
};
