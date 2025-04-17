import express from 'express';
import cors from 'cors';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Lista de domínios permitidos
const allowedOrigins = [
  'https://networq.vercel.app',
  'https://networq-git-main-davipy-labs-projects.vercel.app',
  'https://networq-davipy-labs-projects.vercel.app',
  'http://localhost:3000'
];

// Middleware CORS com credentials
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos JSON
const usersFile = path.join(__dirname, 'users.json');
const profilesFile = path.join(__dirname, 'profiles.json');

if (!fs.existsSync(usersFile) || fs.readFileSync(usersFile, 'utf-8').trim() === '') {
  fs.writeFileSync(usersFile, '[]');
}
if (!fs.existsSync(profilesFile) || fs.readFileSync(profilesFile, 'utf-8').trim() === '') {
  fs.writeFileSync(profilesFile, '[]');
}

// Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso!');
});

// Registrar usuário (apenas email + senha)
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFile));
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({ error: 'Email já registrado!' });
    }

    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = { id: newId, email: email.toLowerCase(), password };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: userWithoutPassword });
  } catch (err) {
    console.error('Erro ao salvar usuário:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Obter usuários
app.get('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFile));
    const usersWithoutPasswords = users.map(({ password, ...u }) => u);
    res.json(usersWithoutPasswords);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler usuários' });
  }
});

// Criar perfil (com imagem + nome)
app.post('/api/create-profile', upload.single('profilePic'), (req, res) => {
  const { userId, username } = req.body;

  if (!userId || !username || !req.file) {
    return res.status(400).json({ error: 'Campos ou imagem ausentes!' });
  }

  try {
    const profiles = JSON.parse(fs.readFileSync(profilesFile));
    const existingProfile = profiles.find(p => p.userId === parseInt(userId));

    if (existingProfile) {
      return res.status(409).json({ error: 'Perfil já criado para este usuário.' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const profile = {
      userId: parseInt(userId),
      username,
      image: imagePath,
      createdAt: new Date().toISOString()
    };

    profiles.push(profile);
    fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));

    res.json({ message: 'Perfil criado com sucesso!', profile });
  } catch (err) {
    console.error('Erro ao criar perfil:', err);
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFile));
    const profiles = JSON.parse(fs.readFileSync(profilesFile));

    const normalizedEmail = email.toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const profile = profiles.find(p => p.userId === user.id) || null;

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: 'Login bem-sucedido', user: userWithoutPassword, profile });
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

// Servir arquivos de imagem
app.use('/uploads', express.static(uploadDir));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
