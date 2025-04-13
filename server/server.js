import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
const usersFile = path.join(__dirname, 'server', 'users.json');

// Garante que o arquivo existe e começa como array vazio se estiver ausente ou vazio
if (!fs.existsSync(usersFile) || fs.readFileSync(usersFile, 'utf-8').trim() === '') {
  fs.writeFileSync(usersFile, '[]');
}

app.post('/api/register', (req, res) => {
  console.log('Dados recebidos:', req.body);  // Log de dados
  const { username, email, password } = req.body;

  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    const users = JSON.parse(data);

    const newUser = { username, email, password };
    users.push(newUser);

    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
})

app.get('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    res.status(500).json({ error: 'Erro ao ler usuários' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}
);