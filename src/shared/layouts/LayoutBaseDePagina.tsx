import { ReactNode } from 'react';
import { Avatar, Icon, IconButton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';

import { useAuthContext, useDrawerContext } from '../contexts';


interface ILayoutBaseDePaginaProps {
  titulo: string;
  children: ReactNode;
  barraDeFerramentas?: ReactNode;
}
export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas }) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();

  const { toggleDrawerOpen } = useDrawerContext();
  const { nomeUsuario } = useAuthContext();

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={1} sx={{marginX: 2}}>
      <Box 
        padding={2} 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        gap={1} 
        height={theme.spacing(smDown ? 6 : mdDown ? 8 : 8)}
      >
        {/* Título e ícone do menu (esquerda) */}
        <Box display="flex" alignItems="center" gap={1}>
          {smDown && (
            <IconButton onClick={toggleDrawerOpen}>
              <Icon>menu</Icon>
            </IconButton>
          )}
          <Typography
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
            maxWidth={smDown ? "120px" : "100%" }
          >
            {titulo}
          </Typography>
        </Box>
        <Box padding={1} display="flex" justifyContent="end" gap={1}>
          <Avatar
            sx={smDown ? { width: '20px', height: '20px' } : { width: '25px', height: '25px' }}
          />
          <Typography 
            sx={{fontWeight: 'bold'}}
            variant={smDown ? 'caption' : mdDown ? 'h6' : 'h6'}
          >{nomeUsuario}</Typography>
        </Box>
      </Box>


      {barraDeFerramentas && (
        <Box>
          {barraDeFerramentas}
        </Box>
      )}

      <Box flex={1} width="100%">
        {children}
      </Box>
    </Box>
  );
};
