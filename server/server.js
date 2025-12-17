const express = require('express');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/form', formRoutes);

app.get('/', (req, res) => {
  res.send('Form Builder API is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


