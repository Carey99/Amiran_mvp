import { connectToMongoDB } from '../shared/db';
import { User } from '../shared/models/user';
import { Course } from '../shared/models/course';
import dotenv from 'dotenv';
import { hashPassword } from './utils/auth';

dotenv.config();

export async function seedInitialData() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Seed admin user
    await seedAdminUser();
    
    // Seed courses
    await seedCourses();
    
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}

export async function seedAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      console.log('Creating default admin user...');
      
      // Hash the password for better security
      const hashedPassword = await hashPassword('admin123');
      
      // Create admin user
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword, // Properly hashed for security
        role: 'super_admin',
        email: 'admin@amirandriving.com',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await adminUser.save();
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

export async function seedCourses() {
  try {
    // Define the courses with correct pricing
    const coursesData = [
      {
        name: 'Class A',
        description: 'Motorcycle license training course',
        type: 'manual',
        duration: 4,
        numberOfLessons: 8,
        fee: 7000,
        active: true,
      },
      {
        name: 'Class B',
        description: 'Manual transmission vehicles training course',
        type: 'manual',
        duration: 8,
        numberOfLessons: 15,
        fee: 11000,
        active: true,
      },
      {
        name: 'Class C',
        description: 'Commercial vehicles training course',
        type: 'both',
        duration: 8,
        numberOfLessons: 15,
        fee: 11000,
        active: true,
      }
    ];

    // Check if courses already exist
    const coursesCount = await Course.countDocuments();
    
    if (coursesCount === 0) {
      console.log('Creating default courses...');
      
      // Insert all courses
      await Course.insertMany(coursesData);
      
      console.log('Default courses created successfully');
    } else {
      console.log('Courses already exist, checking if they need updating...');
      
      // Update course prices if they exist but have different prices
      for (const courseData of coursesData) {
        const existingCourse = await Course.findOne({ name: courseData.name });
        
        if (existingCourse && existingCourse.fee !== courseData.fee) {
          console.log(`Updating course ${courseData.name} with correct fee: ${courseData.fee}`);
          existingCourse.fee = courseData.fee;
          await existingCourse.save();
        }
      }
    }
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
}

// In ESM, we don't use require.main === module
// This code will only run if the script is executed directly with node
// But in our case, we're just importing the function from other files
// so this block won't execute during imports