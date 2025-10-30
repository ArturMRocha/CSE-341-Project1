const dotenv = require('dotenv');
dotenv.config();

const mongoClient = require('mongodb').MongoClient;

let database;

const initDb = async (callback) => {
  if (database) {
    return callback(null, database);
  }

  try {
    const client = await mongoClient.connect(process.env.MONGODB_URL);
    database = client.db();
    callback(null, database);
  } catch (err) {
    callback(err);
  }
};

const getDatabase = () => {
    if (!database) {
        throw new Error('Database not initialized');
    }
    return database;
};

module.exports = {
  initDb,
  getDatabase,
};
