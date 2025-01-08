import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../src/users/entities/user.entity';
import { Role } from '../src/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

async function createTestUsers() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/';

  await mongoose.connect(mongoUri, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DATABASE,
  });

  const User = mongoose.model('User', UserSchema);

  const numberOfUsers = 10;
  const saltOrRounds = 10;

  for (let i = 1; i <= numberOfUsers; i++) {
    const testEmail = `testuser${i}@test.com`;
    const plainPassword = `test123${i}`;
    const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);

    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log(`Użytkownik ${testEmail} już istnieje.`);
      continue;
    }

    const newUser = new User({
      email: testEmail,
      password: hashedPassword,
      role: i % 2 === 0 ? Role.ADMIN : Role.USER,
      isActivated: true,
      profileId: '',
    });

    await newUser.save();
    console.log(`Utworzono użytkownika: ${testEmail}, hasło: ${plainPassword}`);
  }

  await mongoose.disconnect();
  console.log('Tworzenie użytkowników zakończone.');
}

createTestUsers().catch((err) => {
  console.error('Wystąpił błąd:', err);
  process.exit(1);
});
