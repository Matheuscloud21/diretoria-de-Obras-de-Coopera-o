import { ComponentLoader } from 'adminjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

// Primeiro adiciona o componente com o caminho completo
const dashboardPath = path.join(__dirname, 'Dashboard', 'index.jsx');
const dashboardComponent = componentLoader.add('Dashboard', dashboardPath);

// Exporta o componentLoader e os componentes
export { componentLoader, dashboardComponent };