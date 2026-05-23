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

    // Create Users
    const adminUser = await User.create({
      userId: 'admin1',
      password: 'password123', // In a real app, this should be hashed
      role: 'Admin',
      name: 'System Administrator'
    });

    const generalUser1 = await User.create({
      userId: 'user1',
      password: 'password123',
      role: 'General User',
      name: 'Alice Smith'
    });

    const generalUser2 = await User.create({
      userId: 'user2',
      password: 'password123',
      role: 'General User',
      name: 'Bob Johnson'
    });
    console.log('Users created.');

    // Create Records
    await Record.create([
      {
        title: 'Q1 Server Maintenance',
        description: 'Perform routine maintenance on the primary database servers.',
        status: 'Active',
        assignedTo: generalUser1._id
      },
      {
        title: 'Client Onboarding - TechCorp',
        description: 'Complete setup for new client TechCorp.',
        status: 'Pending',
        assignedTo: generalUser1._id
      },
      {
        title: 'Security Audit',
        description: 'Review access logs for Q4.',
        status: 'Resolved',
        assignedTo: generalUser2._id
      },
      {
        title: 'Update Documentation',
        description: 'Update the internal wiki with new API endpoints.',
        status: 'Active',
        assignedTo: generalUser2._id
      },
      {
        title: 'System Architecture Review',
        description: 'Admin level review of the new microservices plan.',
        status: 'Active',
        assignedTo: adminUser._id
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
