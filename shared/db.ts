import mongoose from 'mongoose';

// Connection to MongoDB Atlas
export const connectToMongoDB = async (): Promise<void> => {
  try {
    // Check if MONGODB_URI environment variable is set
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    // Connect to MongoDB Atlas using environment variable with improved connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      retryWrites: true,
      w: 'majority',
      ssl: true,
      tlsAllowInvalidCertificates: true
    });
    
    // Set up event handlers only once to avoid duplicates
    if (mongoose.connection.readyState === 0) { // Only set event handlers if connection is disconnected
      // Handle connection events
      mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB Atlas successfully!');
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
      
      // Handle process termination
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      });
    }
    
    console.log('Connected to MongoDB Atlas successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Disconnect from MongoDB Atlas
export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

// Get mongoose connection status
export const getConnectionStatus = (): number => {
  return mongoose.connection.readyState;
};

// Export mongoose for direct use
export { mongoose };
