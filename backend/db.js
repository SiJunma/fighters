require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectToDB() {
  try {
    await client.connect();
    console.log('Подключение к MongoDB Atlas установлено!');
    const db = client.db('fighters_db');
    return db;
  } catch (error) {
    console.error('Ошибка подключения к MongoDB Atlas:', error);
  }
};

module.exports = connectToDB;
