import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Doctor from './models/Doctor.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected for Seeding'))
.catch(err => {
  console.error(err);
  process.exit(1);
});

const seedDoctors = async () => {
  try {
    // Clear existing doctors (optional, let's just add if none)
    const existing = await Doctor.countDocuments();
    if (existing > 0) {
      console.log('Doctors already exist. Clearing...');
      await Doctor.deleteMany({});
      await User.deleteMany({ role: 'doctor' });
    }

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    const doctorsData = [
      {
        name: 'John Smith',
        email: 'john.smith@medicore.com',
        department: 'Cardiology',
        floor: 1,
        room: '101A'
      },
      {
        name: 'Sarah Jane',
        email: 'sarah.jane@medicore.com',
        department: 'Cardiology',
        floor: 1,
        room: '102B'
      },
      {
        name: 'Robert Brown',
        email: 'robert.brown@medicore.com',
        department: 'Neurology',
        floor: 2,
        room: '201A'
      },
      {
        name: 'Emily Clark',
        email: 'emily.clark@medicore.com',
        department: 'Orthopedics',
        floor: 3,
        room: '305C'
      }
    ];

    for (const doc of doctorsData) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: defaultPassword,
        role: 'doctor'
      });

      await Doctor.create({
        userRef: user._id,
        specialization: doc.department,
        qualifications: ['MBBS', 'MD'],
        experience: 10,
        consultationFee: 100,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['10:00 AM - 01:00 PM', '02:00 PM - 05:00 PM'],
        floorNumber: doc.floor,
        roomNumber: doc.room
      });
    }

    console.log('Doctors Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors();
