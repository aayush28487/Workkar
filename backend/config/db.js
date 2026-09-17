import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
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

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const safeError = error.message.replace(/:[^@]+@/, ':****@');
    console.error(`Error connecting to MongoDB: ${safeError}`);
    process.exit(1);
  }
};

export default connectDB;

