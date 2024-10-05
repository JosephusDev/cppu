import React from 'react';
import { Card, CardContent, Typography, Grid, useMediaQuery, useTheme, Box } from '@mui/material';

interface ResponsiveCardProps {
    title: string;
    number: string;
    icon?: React.ReactNode;
    aoClicar?: () => void;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ title, number, icon, aoClicar }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    let gridSize = 4; // Default size for large screens

    if (isSmallScreen) {
        gridSize = 12; // Full width on small screens
    } else if (isMediumScreen) {
        gridSize = 6; // Half width on medium screens
    } else if (isLargeScreen) {
        gridSize = 4; // One third width on large screens
    }

    return (
        <Grid item xs={gridSize} onClick={aoClicar}>
            <Card sx={{ minHeight: 100, marginBottom: 3 }}>
                <CardContent>
                    {icon}
                    <Box textAlign="center">
                        <Typography sx={{fontWeight: "bold"}} variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="h6" component="div" color="primary">
                            {number}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ResponsiveCard;
