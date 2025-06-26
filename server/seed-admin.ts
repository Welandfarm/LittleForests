import bcrypt from 'bcrypt';
import { storage } from './storage';

const SALT_ROUNDS = 12;

async function seedAdminUsers() {
  const adminEmails = [
    'wesleykoech2022@gmail.com',
    'chepkoechjoan55@gmail.com'
  ];

  // Default password - in production, these should be changed
  const defaultPassword = 'LittleForest2025!';
  const hashedPassword = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

  try {
    for (const email of adminEmails) {
      // Check if admin user already exists
      const existingUser = await storage.getAdminUserByEmail(email);
      
      if (!existingUser) {
        await storage.createAdminUser({
          email,
          passwordHash: hashedPassword
        });
        console.log(`Created admin user: ${email}`);
      } else {
        console.log(`Admin user already exists: ${email}`);
      }
    }
    
    console.log('Admin user seeding completed!');
    console.log(`Default password for all admin users: ${defaultPassword}`);
    console.log('Please change passwords after first login');
    
  } catch (error) {
    console.error('Error seeding admin users:', error);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdminUsers().then(() => process.exit(0));
}

export { seedAdminUsers };