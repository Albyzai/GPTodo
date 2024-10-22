import mongoose from 'mongoose';

export class DatabaseConnection {
  static #instance: DatabaseConnection;
  #connection: mongoose.Connection | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }

  async connect(): Promise<void> {
    const connectionString = Deno.env.get('MONGO_CONNECTION_STRING');

    if (!connectionString) {
      throw new Error('MONGO_CONNECTION_STRING environment variable is not set');
    }

    try {
      await mongoose.connect(connectionString);
      this.#connection = mongoose.connection;
      console.log('Connected to MongoDB using Mongoose');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  getConnection(): mongoose.Connection {
    if (!this.#connection) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.#connection;
  }

  async close(): Promise<void> {
    if (this.#connection) {
      await mongoose.disconnect();
      this.#connection = null;
      console.log('Disconnected from MongoDB');
    }
  }
}

export default async function SetupDatabase() {
  const db = DatabaseConnection.getInstance();
  await db.connect();
  return db.getConnection();
  // return async () => {
  //   const db = DatabaseConnection.getInstance();
  //   await db.connect();
  //   return db.getConnection();
  // };
}
