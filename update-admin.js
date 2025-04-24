// Script to update admin user password directly
import dotenv from 'dotenv';
import { connectToMongoDB, disconnectFromMongoDB } from './shared/db.js';
import { User } from './shared/models/user.js';

dotenv.config();

async function updateAdminPassword() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    console.log('Connected to MongoDB Atlas');
    
    // Update admin user
    const result = await User.updateOne(
      { username: 'admin' },
      { $set: { password: 'admin123' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('Admin password updated successfully');
    } else {
      console.log('Admin user not found or password already set');
    }
    
    // Disconnect
    await disconnectFromMongoDB();
    console.log('Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('Error updating admin password:', error);
  }
}

updateAdminPassword();