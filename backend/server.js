const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const characterRoutes = require('./routes/characterRoutes');
const supportCardRoutes = require('./routes/supportCardRoutes');
const skillRoutes = require('./routes/skillRoutes');
const umaCharacterRoutes = require('./routes/umaCharacterRoutes');
const iconUploadRoutes = require('./routes/iconUploadRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/umapyoi')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/characters', characterRoutes);
app.use('/api/support-cards', supportCardRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/uma-characters', umaCharacterRoutes);
app.use('/api/icons', iconUploadRoutes);

// Route kiểm tra sức khỏe (Health Check) phục vụ Ping chống ngủ đông của Render
app.get('/', (req, res) => {
  res.send('Umapyoi Portal Backend is running! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
