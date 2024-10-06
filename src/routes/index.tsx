import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  HomeScreen,
  Membro,
  MembroPorGrupos,
  CategoriaMembro
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
