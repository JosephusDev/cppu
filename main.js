const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let apiProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'public/avatar.png'),
    maximizable: true
  });

  win.removeMenu();
  win.maximize();

  // Carrega o React diretamente do build estático gerado
  win.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`);

  // Abrir as ferramentas de desenvolvedor (caso deseje para debugar)
  // win.webContents.openDevTools();
}

function startNodeServer() {
  const apiPath = path.resolve(__dirname, 'api/index.js');
  
  // Inicia o servidor Node.js da API
  apiProcess = exec(`node ${apiPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao iniciar o servidor da API: ${error}`);
      return;
    }
    console.log(`Servidor da API iniciado: ${stdout}`);
  });
}

app.whenReady().then(() => {
  startNodeServer();

  // Criar a janela após a inicialização
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quando todas as janelas forem fechadas
app.on('window-all-closed', function () {
  // Mata o processo da API
  if (apiProcess) apiProcess.kill();

  // Fecha a aplicação, exceto no macOS
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Finalizar a aplicação corretamente
app.on('before-quit', () => {
  if (apiProcess) apiProcess.kill();
});
