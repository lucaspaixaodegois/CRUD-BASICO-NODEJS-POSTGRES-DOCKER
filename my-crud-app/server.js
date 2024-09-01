const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  console.log('Database connected...');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => console.log('Error: ' + err));
