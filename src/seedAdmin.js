import 'dotenv/config';
import bcrypt from 'bcryptjs';
import db from './config/db/index.js';

const seedAdmin = async () => {
    try {
        const email = process.env.SEED_ADMIN_EMAIL;
        const password = process.env.SEED_ADMIN_PASSWORD;
        const fullName = process.env.SEED_ADMIN_FULL_NAME;

        const existingsuperAdmin = await db.oneOrNone('SELECT id, email FROM users WHERE email = $1', [email.trim().toLowerCase()]);

        if (existingsuperAdmin) {
            console.log('Admin user already exists with email provided.');
            process.exit(0); 
        }

        // hash password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            
        // Create admin user
        await db.none(`INSERT INTO users (email, password, username, status, role, is_verified_account, ip_address) 
            VALUES ($1, $2, $3, $4, $5, $6)`, 
            [email.trim().toLowerCase(), hash, fullName, '5' , 'active','admin', true, true]);

        console.log(`Successfully Seeded admin with email ${email}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

seedAdmin();