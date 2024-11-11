const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const datasetRoutes = require('./routes/dataset');





dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/dataset', datasetRoutes);
console.log("API Key:", process.env.OPENAI_API_KEY);

app.use('/api/auth', authRoutes);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log('Server running on port 5000'));
