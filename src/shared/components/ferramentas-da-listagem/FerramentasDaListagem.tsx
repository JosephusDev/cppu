import React from 'react';
import { Box, Button, Icon, Paper, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IFerramentasDaListagemProps {
  aoClicarEmNovo?: () => void;
  textoBotao?: string;
  iconButton?: string;
  mostrarCampos?: boolean;
  children?: React.ReactNode;
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
  aoClicarEmNovo,
  textoBotao = "Novo",
  iconButton = 'add_circle',
  mostrarCampos = false,
  children,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const theme = useTheme();

  return (
    <Box
      gap={1}
      padding={2}
      paddingX={1}
      display="flex"
      alignItems="center"
      height={theme.spacing(3)}
      component={Paper}
    >
      {mostrarCampos && children}
      <Box flex={1} display="flex" justifyContent="end">
        <Button
          color='primary'
          onClick={aoClicarEmNovo}
          variant='contained'
        >
          <Icon>{iconButton}</Icon>&nbsp;{smDown ? '' : textoBotao}
        </Button>
      </Box>
    </Box>
  );
};
