'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10; // Define o número de rounds para o salt
    const users = [
      {
        name: 'Ana Souza',
        email: 'ana.souza@example.com',
        age: 25,
        password: 'senha123', // Em produção, use hashing para senhas
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bruno Lima',
        email: 'bruno.lima@example.com',
        age: 30,
        password: 'senha456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Carla Mendes',
        email: 'carla.mendes@example.com',
        age: 22,
        password: 'senha789',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Daniel Oliveira',
        email: 'daniel.oliveira@example.com',
        age: 28,
        password: 'senha101',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Eduarda Martins',
        email: 'eduarda.martins@example.com',
        age: 35,
        password: 'senha202',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Felipe Gonçalves',
        email: 'felipe.goncalves@example.com',
        age: 27,
        password: 'senha303',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gabriela Silva',
        email: 'gabriela.silva@example.com',
        age: 32,
        password: 'senha404',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Henrique Santos',
        email: 'henrique.santos@example.com',
        age: 24,
        password: 'senha505',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Isabela Ferreira',
        email: 'isabela.ferreira@example.com',
        age: 29,
        password: 'senha606',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'João Almeida',
        email: 'joao.almeida@example.com',
        age: 31,
        password: 'senha707',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Hashear as senhas antes de inserir no banco de dados
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, saltRounds);
    }

    return queryInterface.bulkInsert('Users', users);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
