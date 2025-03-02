import { bundle } from '@adminjs/bundler';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundleAdminJS = async () => {
  try {
    console.log('📦 Iniciando bundle do AdminJS...');
    
    // Criar diretório de destino se não existir
    const destinationDir = path.join(__dirname, '../public/admin');
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }
    
    // Importa o componentLoader e aguarda sua inicialização
    const { componentLoader } = await import('../src/admin/components/index.js');
    
    // Aguarda um momento para garantir que os componentes foram registrados
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔍 Verificando componentes registrados...');
    
    await bundle({
      componentLoader,
      destinationDir,
      watch: process.env.ADMINJS_WATCH === 'true',
      debug: true
    });
    
    console.log('✅ Bundle do AdminJS concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar bundle:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

bundleAdminJS();