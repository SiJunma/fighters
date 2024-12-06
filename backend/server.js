const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;

app.use(cors()); // Разрешает запросы с других доменов (например, с localhost:3000)
// Middleware для обработки JSON
app.use(express.json());

(async () => {
  try {
    const db = await connectToDB();
    console.log('База данных подключена!');

    const fightersCollection = db.collection('fighters');

    // Эндпоинт для получения данных
    app.get('/api/getAllFighters', async (req, res) => {
      const fighters = await fightersCollection.find().toArray();
      res.json(fighters);
    });

    app.get('/api/getOneFighter', async (req, res) => {
      try {
        const id = req.query.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid ID format' });
        };
        
        const fighter = await fightersCollection.findOne({ _id: new ObjectId(id) });

        if (!fighter) {
          return res.status(404).json({ error: 'Fighter not found' });
        };

        res.json(fighter);

      } catch (error) {
        console.error('Error retrieving fighter:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Эндпоинт для добавления пользователя
    app.post('/api/addNewFighter', async (req, res) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty or invalid JSON' });
      };

      const result = await fightersCollection.insertOne(req.body[0]);
      res.status(201).json({ message: 'Fighter added', id: result.insertedId, result });
    });

    app.put('/api/updateFighter', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      try {
        const result = await fightersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Fighter not found' });
        };

        res.json({ message: `Fighter with id ${id} updated successfully` });

      } catch (error) {
        console.error('Error updating fighter:', error);
        res.status(500).json({ error: 'Internal server error' });
      };
    });

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка подключения к базе данных:', err);
  }
})();
