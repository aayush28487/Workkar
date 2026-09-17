import mongoose from 'mongoose';
import dns from 'dns';

let isConnecting = false;

const connectDB = async (retryCount = 0) => {
  if (mongoose.connection.readyState === 1) return;
  if (isConnecting) return;
  isConnecting = true;

  try {
    let uri = process.env.MONGODB_URI;
    if (uri) {
      uri = uri.trim().replace(/^["']|["']$/g, '');
      // Automatically clean accidental angle brackets around the password: :<password>@ -> :password@
      uri = uri.replace(/:<([^>]+)>@/, ':$1@');
    }

    // Configure reliable DNS servers for MongoDB Atlas SRV record resolution
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (_) {}

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    const safeError = error.message.replace(/:[^@]+@/, ':****@');
    console.error(`Error connecting to MongoDB (attempt ${retryCount + 1}): ${safeError}`);

    // Retry connection up to 10 times without killing the web process
    if (retryCount < 10) {
      const delay = Math.min(5000 * Math.pow(1.2, retryCount), 15000);
      console.log(`Retrying MongoDB connection in ${Math.round(delay / 1000)}s...`);
      setTimeout(() => connectDB(retryCount + 1), delay);
    } else {
      console.error('All initial MongoDB connection retries failed. Server remains active to handle health checks.');
    }
  }
};

export default connectDB;

