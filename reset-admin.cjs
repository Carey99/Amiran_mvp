const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Schema, model } = mongoose;

dotenv.config();

// Define minimal User schema for this script
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['super_admin', 'admin', 'instructor'] }
});

const User = mongoose.models.User || model('User', userSchema);

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
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
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('Error updating admin password:', error);
  }
}

resetAdminPassword();