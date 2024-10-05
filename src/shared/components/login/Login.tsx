import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, CircularProgress, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAuthContext } from '../../contexts';
import { toast } from 'react-toastify';
import LoginIcon from '@mui/icons-material/Login';

const Login: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [utilizador, setUtilizador] = useState('');
    const [senha, setSenha] = useState('');

    const { isAuthenticated, handleLogin, nivelUsuario, setNivelUsuario, carregando } = useAuthContext();

    useEffect(() => {
        if (nivelUsuario === "0") {
            notify();
            setNivelUsuario("");
        }
    }, [nivelUsuario]);

    const fazerLogin = () => {
        if (!utilizador || !senha) {
            notifyPreencherCampos();
        } else {
            setUtilizador('');
            setSenha('');
            handleLogin(utilizador.trim(), senha.trim());
        }
    };

    const Carregando = () => {
        return (
            <CircularProgress color="inherit" size={14} />
        );
    };

    const notify = () => toast.error('Utilizador não encontrado!', { autoClose: 2000, position: 'bottom-right' });
    const notifyPreencherCampos = () => toast.error('Preencha todos os campos!', { autoClose: 2000, position: 'bottom-right' });

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',
                backgroundImage: `url(${require('../../img/bg.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.5)', // Opacidade e cores adaptadas ao tema
                    backdropFilter: 'blur(5px)', // Aumentei o desfoque para um efeito mais suave
                    zIndex: 1,
                }}
            />
            <Box
                sx={{
                    padding: '50px',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '65%',
                    backgroundColor: theme.palette.background.paper, // Usa a cor de fundo do tema
                    borderRadius: '10px',
                    boxShadow: theme.shadows[5], // Adicionei uma sombra para destaque
                    zIndex: 2, // Certifica que o conteúdo esteja acima da camada de fundo
                    color: theme.palette.text.primary, // Garante que o texto esteja visível
                }}
            >
                <Avatar
                    src={require("../../img/avatar.png")}
                    sx={{ width: theme.spacing(12), height: theme.spacing(12) }}
                />
                <Typography variant='subtitle1' sx={{ marginY: 3, fontWeight: 'bold', textAlign: 'center' }}>Comitê Provincial do Partido MPLA</Typography>
                <TextField
                    type='text'
                    size='small'
                    label='Utilizador'
                    fullWidth
                    style={{ marginBottom: 25, width: isSmallScreen ? '80%' : isMediumScreen ? '60%' : '60%' }}
                    value={utilizador}
                    onChange={(e) => setUtilizador(e.target.value)}
                    disabled={carregando}
                />
                <TextField
                    type='password'
                    size='small'
                    label='Palavra-passe'
                    fullWidth
                    style={{ marginBottom: 25, width: isSmallScreen ? '80%' : isMediumScreen ? '60%' : '60%' }}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={carregando}
                />
                <Box display="flex" justifyContent="center" width="100%">
                    <Button
                        variant="contained"
                        color="primary"
                        disableElevation
                        startIcon={carregando ? null : <LoginIcon />}
                        onClick={fazerLogin}
                        style={{ width: isSmallScreen ? "50%" : isMediumScreen ? "60%" : "30%" }}
                    >
                        {carregando ? <Carregando /> : <Typography variant='subtitle2'>Entrar</Typography>}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
