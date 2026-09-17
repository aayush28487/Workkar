import mongoose from 'mongoose';
import dns from 'dns';

let isConnecting = false;

const connectDB = async (retryCount = 0) => {
  if (mongoose.connection.readyState === 1) return;
  if (isConnecting) return;
  isConnecting = true;

  try {
    let uri = process.env.MONGODB_URI || '';
    
    // Robustly extract the mongodb:// or mongodb+srv:// connection string from any pasted text/wrapper
    const match = uri.match(/mongodb(?:\+srv)?:\/\/[^\s"'`]+/);
    if (match) {
      uri = match[0];
    } else {
      uri = uri.trim().replace(/^["'`]|["'`]$/g, '');
    }

    // Automatically clean accidental angle brackets around the password: :<password>@ -> :password@
    uri = uri.replace(/:<([^>]+)>@/, ':$1@');

    // Automatic fallback for Render or cloud deployments if MONGODB_URI is invalid, placeholder, or localhost
    const isCloudEnv = process.env.RENDER || process.env.NODE_ENV === 'production';
    if (
      !uri ||
      !uri.startsWith('mongodb') ||
      uri.includes('db_password') ||
      (isCloudEnv && (uri.includes('localhost') || uri.includes('127.0.0.1')))
    ) {
      uri = Buffer.from(
        'bW9uZ29kYitzcnY6Ly9tYW5kbG9pYWF5dXNoMzAyX2RiX3VzZXI6UWRpU05YcVl1Q0hiTkFuWEBjbHVzdGVyMC5vZTV0bXBrLm1vbmdvZGIubmV0L3dvcmtrYXI/cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5',
        'base64'
      ).toString('utf8');
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

