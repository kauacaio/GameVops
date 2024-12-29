require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'securepassword123',
  database: process.env.DB_NAME || 'gamevopsdb',
  port: 5432,
});

// Middleware
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.send('GameVops Backend está rodando!');
});

// Rota para criar usuário (cadastro)
app.post('/register', async (req, res) => {
    const { name, email, dob, password } = req.body;
  
    if (!name || !email || !dob || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      await pool.query('INSERT INTO users (name, email, dob, password) VALUES ($1, $2, $3, $4)', [
        name, email, dob, hashedPassword
      ]);
      res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });
  

// Rota para login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
      res.json({ message: 'Login realizado com sucesso', token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao realizar login' });
    }
  });
  

// Rota para registrar pontuações
app.post('/score', async (req, res) => {
  const { username, score } = req.body;

  try {
    await pool.query('INSERT INTO scores (username, score) VALUES ($1, $2)', [username, score]);
    res.status(201).json({ message: 'Pontuação registrada!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar pontuação' });
  }
});

// Rota para consultar pontuações
app.get('/scores', async (req, res) => {
  try {
    const result = await pool.query('SELECT username, score FROM scores ORDER BY score DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pontuações' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
