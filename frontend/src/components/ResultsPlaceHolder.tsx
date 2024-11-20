import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ResultsPlaceHolder: React.FC = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
        >
            <ArrowBackIcon className="text-white-100" style={{ fontSize: 100 }} />
            <Typography className="text-white-100" variant="h4">Argh where is that one bit in the video!? Search for it!</Typography>
        </Box>
    );
};

export default ResultsPlaceHolder;