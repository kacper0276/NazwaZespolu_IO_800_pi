import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserSchema } from '../src/users/entities/user.entity';
import { ProfileSchema } from '../src/profiles/entities/profile.entity';
import { Role } from '../src/enums/role.enum';
import * as dotenv from 'dotenv';
dotenv.config();

async function createTestUsersAndProfiles() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/';

  await mongoose.connect(mongoUri, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DATABASE,
  });

  const User = mongoose.model('User', UserSchema);
  const Profile = mongoose.model('Profile', ProfileSchema);

  await User.deleteMany({});
  await Profile.deleteMany({});
  console.log('Wszyscy użytkownicy i profile zostały usunięte.');

  const numberOfUsers = 10;
  const saltOrRounds = 10;

  for (let i = 1; i <= numberOfUsers; i++) {
    const testEmail = `testuser${i}@test.com`;
    const plainPassword = `test123${i}`;
    const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);

    let user = await User.findOne({ email: testEmail });
    if (!user) {
      user = new User({
        email: testEmail,
        password: hashedPassword,
        role: i % 2 === 0 ? Role.ADMIN : Role.USER,
        isActivated: true,
      });

      user = await user.save();
      console.log(
        `Utworzono użytkownika: ${testEmail}, hasło: ${plainPassword}`,
      );
    } else {
      console.log(`Użytkownik ${testEmail} już istnieje.`);
    }

    const existingProfile = await Profile.findOne({
      userId: user._id.toString(),
    });

    let profileId = '';
    if (!existingProfile) {
      const newProfile = new Profile({
        currentGoals: [`Cel użytkownika ${i}`],
        completedGoals: [],
        followers: [],
        following: [],
        premium: i % 2 === 0,
        posts: [],
        userId: user._id.toString(),
        user: user._id,
      });

      const savedProfile = await newProfile.save();
      profileId = savedProfile._id.toString();
      console.log(
        `Utworzono profil dla użytkownika ${testEmail}, ID profilu: ${profileId}`,
      );
    } else {
      profileId = existingProfile._id.toString();
      console.log(`Profil dla użytkownika ${testEmail} już istnieje.`);
    }

    user.profileId = profileId;
    await user.save();
  }

  await mongoose.disconnect();
  console.log('Tworzenie użytkowników i profili zakończone.');
}

createTestUsersAndProfiles().catch((err) => {
  console.error('Wystąpił błąd:', err);
  process.exit(1);
});
