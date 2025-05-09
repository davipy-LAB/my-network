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
  'http://localhost:3000',
];

// Middleware CORS com credentials
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS bloqueado para a origem: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Caminhos para arquivos JSON
const usersFile = path.join(__dirname, 'users.json');
const profilesFile = path.join(__dirname, 'profiles.json');

// Inicializar arquivos JSON se não existirem ou estiverem vazios
const initializeFile = (filePath, defaultContent) => {
  if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf-8').trim() === '') {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
  }
};
initializeFile(usersFile, []);
initializeFile(profilesFile, []);

// Configuração de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso!');
});

// Registrar usuário e criar perfil
app.post('/api/register', (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Preencha todos os campos!' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const profiles = JSON.parse(fs.readFileSync(profilesFile, 'utf-8'));

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return res.status(409).json({ error: 'Email já registrado!' });
    }

    // Criar novo usuário
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
    const newUser = { id: newUserId, email: email.toLowerCase(), password };

    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');

    // Criar perfil vinculado ao usuário
    const newProfile = {
      userId: newUserId,
      username,
      image: null, // Pode ser atualizado posteriormente
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2), 'utf-8');

    res.status(201).json({
      message: 'Usuário e perfil criados com sucesso!',
      user: { id: newUserId, email },
      profile: newProfile,
    });
  } catch (err) {
    console.error('Erro ao registrar usuário e criar perfil:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário e criar perfil' });
  }
});

// Obter usuários
app.get('/api/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const usersWithoutPasswords = users.map(({ password, ...u }) => u);
    res.json(usersWithoutPasswords);
  } catch (err) {
    console.error('Erro ao ler usuários:', err);
    res.status(500).json({ error: 'Erro ao ler usuários' });
  }
});

// Criar ou atualizar perfil (com imagem + nome)
app.post('/api/create-profile', upload.single('profilePic'), (req, res) => {
  const { userId, username } = req.body;

  const userIdNumber = parseInt(userId, 10);
  if (isNaN(userIdNumber) || !username) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes!' });
  }

  try {
    const profiles = JSON.parse(fs.readFileSync(profilesFile, 'utf-8'));
    const existingProfile = profiles.find(p => p.userId === userIdNumber);

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (existingProfile) {
      // Atualizar perfil existente
      existingProfile.username = username;
      if (imagePath) existingProfile.image = imagePath;
      existingProfile.updatedAt = new Date().toISOString();
    } else {
      // Criar novo perfil
      const newProfile = {
        userId: userIdNumber,
        username,
        image: imagePath,
        createdAt: new Date().toISOString(),
      };
      profiles.push(newProfile);
    }

    fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2), 'utf-8');

    res.json({ message: 'Perfil salvo com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar perfil:', err);
    res.status(500).json({ error: 'Erro ao salvar perfil' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const profiles = JSON.parse(fs.readFileSync(profilesFile, 'utf-8'));

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
