import express from 'express';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Arquivo de usuários
const usersFile = path.join(__dirname, 'users.json');
if (!fs.existsSync(usersFile) || fs.readFileSync(usersFile, 'utf-8').trim() === '') {
  fs.writeFileSync(usersFile, '[]');
}

// Pasta de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer - configurações para salvar a imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rota para registro de usuário
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(usersFile));
    users.push({ username, email, password });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Rota para obter usuários
app.get('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFile));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler usuários' });
  }
});

// Rota de criação de perfil com upload de imagem
app.post('/api/create-profile', upload.single('profilePic'), (req, res) => {
  const username = req.body.username;
  const imagePath = `/uploads/${req.file.filename}`;
  const profile = {
    username,
    image: imagePath,
    createdAt: new Date().toISOString()
  };

  const profilesFile = path.join(__dirname, 'profiles.json');
  let profiles = [];
  if (fs.existsSync(profilesFile)) {
    profiles = JSON.parse(fs.readFileSync(profilesFile));
  }

  profiles.push(profile);
  fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
  res.json({ message: 'Perfil criado com sucesso!', profile });
});

// Servir as imagens da pasta uploads
app.use('/uploads', express.static(uploadDir));


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
