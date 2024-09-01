const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models');

// Rota para criar um novo usuário
router.post('/users', async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    
    // Hashing da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criação do usuário com senha hasheada
    const user = await User.create({ name, email, age, password: hashedPassword });
    
    // Remover a senha da resposta
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Rota para obter todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclui a senha dos resultados
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para obter um usuário por ID
router.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Certifique-se de que o ID seja um número
  console.log(`Recebendo solicitação para obter o usuário com ID: ${userId}`); // Log para depuração
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] } // Exclui a senha dos resultados
    });
    if (user) {
      console.log(`Usuário encontrado: ${JSON.stringify(user)}`); // Log para depuração
      res.status(200).json(user);
    } else {
      console.log('Usuário não encontrado'); // Log para depuração
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error); // Log de erro
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
});

// Rota para atualizar um usuário por ID
router.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Certifique-se de que o ID seja um número
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const { name, email, age, password } = req.body;
    
    // Hashing da senha antes de atualizar
    const hashedPassword = await bcrypt.hash(password, 10);

    const [updated] = await User.update(
      { name, email, age, password: hashedPassword },
      { where: { id: userId } }
    );
    
    if (updated) {
      const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] } // Exclui a senha dos resultados
      });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Rota para deletar um usuário por ID
router.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Certifique-se de que o ID seja um número
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const deleted = await User.destroy({
      where: { id: userId }
    });
    if (deleted) {
      res.status(204).json(); // No Content
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
