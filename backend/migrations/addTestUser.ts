import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../src/users/entities/user.entity';
import { Role } from '../src/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

async function createTestUser() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/';

  await mongoose.connect(mongoUri, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DATABASE,
  });

  const User = mongoose.model('User', UserSchema);

  const testEmail = 'testuser@test.com';
  const plainPassword = 'test123';
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);

  const existingUser = await User.findOne({ email: testEmail });
  if (existingUser) {
    console.log('Testowy użytkownik już istnieje.');
    return;
  }

  const newUser = new User({
    email: testEmail,
    password: hashedPassword,
    role: Role.USER,
    isActivated: true,
  });

  await newUser.save();
  console.log('Testowy użytkownik został utworzony.');

  await mongoose.disconnect();
}

createTestUser().catch((err) => {
  console.error('Wystąpił błąd:', err);
  process.exit(1);
});
