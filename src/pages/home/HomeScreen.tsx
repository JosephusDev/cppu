import React, { useEffect, useState } from 'react';
import { Grid, Container, Icon, useTheme, Box, Button, useMediaQuery, Theme } from '@mui/material';
import ResponsiveCard from '../../shared/components/card/Card';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../shared/services/api/Index';
import BarChartComponent from '../../shared/components/charts/BarChartComponent';
import PieChartComponent from '../../shared/components/charts/PieChartComponent';
import { useAuthContext } from '../../shared/contexts';

interface categoriaData {
    id: number;
    categoria: string;
    membros: number;
}

interface barData {
    name: string;
    value: number;
}

interface Card {
    id: number;
    tipo: string;
    title: string;
    number: string;
    icon: JSX.Element;
}

export const HomeScreen: React.FC = () => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const theme = useTheme();
    const navigate = useNavigate();
    const { nivelUsuario } = useAuthContext();

    const [cards, setCards] = useState<Card[]>([]);
    const [bar, setBar] = useState<barData[]>([]);

    useEffect(() => {

        Api.get('/categoria/contagem').then((response) => {
            const updatedCards: Card[] = [];
            response.data.forEach((categoria: categoriaData) => {
                updatedCards.push({
                    id: categoria.id,
                    tipo: 'categoria',
                    title: categoria.categoria,
                    number: `${categoria.membros} Membros`,
                    icon: <Icon fontSize='large' sx={{ fontSize: 35 }}>people</Icon>,
                });
            });

            setCards(updatedCards);
        }).catch((error) => {
            console.error(error);
        });

        Api.get('/membro/contagem-municipio').then((response) => {
            setBar(response.data)
        }).catch((error) => {
            console.error(error);
        });
    }, []);
      
    // Evento de clique nos cards para navegar para a página de membros por grupo
    const handleCardClick = (id: Number, tipo: string, title: string) => {
        if(nivelUsuario === 'admin'){
            navigate(`/membrosporgrupos/${id}/${tipo}/${title}`);
        }
    };

    return (
        <LayoutBaseDePagina titulo='Dashboard'>
            <Container>
                <Grid container columnSpacing={2}>
                    {cards.map((card, index) => (
                        <ResponsiveCard key={index} aoClicar={() => handleCardClick(card.id, card.tipo, card.title)} title={card.title.replace(/M-/g, "M/")} number={card.number} icon={card.icon} />
                    ))}
                </Grid>
                <Grid sx={{width: '100%', display:'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default}}>
                    <BarChartComponent data={bar} title="Membros por municípios" />
                    <PieChartComponent data={bar} title="Membros por municípios" />
                </Grid>
            </Container>
        </LayoutBaseDePagina>
    );
};
