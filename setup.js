import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/student_db
JWT_SECRET=your_super_secret_key_123
`;
  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully');
}

// Load environment variables
dotenv.config();

// Verify JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env file');
  process.exit(1);
}

console.log('Environment setup completed successfully'); 