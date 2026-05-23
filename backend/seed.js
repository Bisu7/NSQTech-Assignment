require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Record = require('./models/Record');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nsqtech-db';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('Cleared existing data.');

    // Create Dummy Users
    const adminUser = await User.create({
      name: 'System Administrator',
      userId: 'admin1',
      password: 'password123',
      role: 'Admin'
    });

    const generalUser1 = await User.create({
      name: 'Alice Smith',
      userId: 'user1',
      password: 'password123',
      role: 'General User'
    });

    const generalUser2 = await User.create({
      name: 'Bob Johnson',
      userId: 'user2',
      password: 'password123',
      role: 'General User'
    });
    console.log('Users created.');

    // Create Dummy Records
    await Record.create([
      {
        title: 'Financial Q1 Report',
        description: 'Contains sensitive financial data for the first quarter.',
        accessLevel: 'Confidential',
        assignedUser: generalUser1._id
      },
      {
        title: 'Project Alpha Design Specs',
        description: 'Design documentation for Project Alpha.',
        accessLevel: 'Internal',
        assignedUser: generalUser1._id
      },
      {
        title: 'Public API Documentation',
        description: 'Endpoints and usage examples for external consumers.',
        accessLevel: 'Public',
        assignedUser: generalUser2._id
      },
      {
        title: 'Employee Performance Reviews',
        description: 'Annual performance metrics and HR reviews.',
        accessLevel: 'Restricted',
        assignedUser: generalUser2._id
      },
      {
        title: 'System Architecture Blueprints',
        description: 'High-level infrastructure design.',
        accessLevel: 'Confidential',
        assignedUser: adminUser._id
      }
    ]);
    console.log('Records created.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
