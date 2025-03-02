import React from 'react';
import { Box, H2, Text } from '@adminjs/design-system';

const Dashboard = () => {
  return (
    <Box variant="grey">
      <Box variant="white" style={{ padding: '1.5rem' }}>
        <H2>Bem-vindo ao Painel Administrativo</H2>
        <Text>
          Sistema de gerenciamento de arquivos e conteúdo da Diretoria de Obras de Cooperação.
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;