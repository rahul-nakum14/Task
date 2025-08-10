import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User from '../src/models/User';

async function insertUsers() {
  await mongoose.connect(process.env.MONGO_URI || "");

  const users = [
    { UserID: 'user1', UserName: 'JoHnDoe', Email: 'user1@gmail.com' }
  ];

  await User.insertMany(users);
  console.log('Users inserted');
  process.exit(0);
}

insertUsers().catch(console.error);
