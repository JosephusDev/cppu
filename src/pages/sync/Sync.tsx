import { useEffect, useState } from 'react';
import { Api } from '../../shared/services/api/Index';
import { useAuthContext } from '../../shared/contexts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Sync = () => {
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { chaveSecreta } = useAuthContext();

    useEffect(() => {
        const syncDatabases = async () => {
            try {
                setLoading(true);
                // Chamada à API para sincronização
                const response = await Api.get(`/backup/${chaveSecreta}`);
                console.log('Sincronização realizada com sucesso:', response.data);
                setMessage('Sincronização concluída com sucesso!');
                setTimeout(() => navigate("/home"), 2000);
            } catch (error) {
                console.error('Erro durante a sincronização:', error);
                setMessage('Erro durante a sincronização.');
                setTimeout(() => navigate("/home"), 2000);
            } finally {
                setLoading(false);
            }
        };

        syncDatabases();
    }, [chaveSecreta, navigate]);

    return (
        <Box 
            display="flex" 
            flexDirection="column" // Alinha os itens na vertical
            justifyContent="center" 
            alignItems="center" 
            height="100vh"
        >
            {isLoading ? (
                <>
                    <Typography marginBottom={2}>Sincronizando os dados</Typography>
                    <CircularProgress />
                </>
            ) : (
                <Typography variant="h6">{message}</Typography>
            )}
        </Box>
    );
};
