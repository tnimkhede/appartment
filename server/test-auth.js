const bcrypt = require('bcryptjs');
const { User } = require('./models');
const { connectDB } = require('./config/db');

const testAuth = async () => {
    try {
        await connectDB();

        // Find admin user
        const admin = await User.findOne({ where: { email: 'admin@apt.com' } });

        if (!admin) {
            console.log('❌ Admin user not found');
            process.exit(1);
        }

        console.log('✅ Admin user found:', admin.email);
        console.log('Stored password hash:', admin.password.substring(0, 20) + '...');

        // Test password comparison
        const plainPassword = 'pass123';
        const isMatch = await bcrypt.compare(plainPassword, admin.password);

        console.log('\nPassword Test:');
        console.log('Plain password:', plainPassword);
        console.log('Match result:', isMatch ? '✅ PASS' : '❌ FAIL');

        // Test matchPassword method
        const methodMatch = await admin.matchPassword(plainPassword);
        console.log('Method match:', methodMatch ? '✅ PASS' : '❌ FAIL');

        // If failed, manually hash and update
        if (!isMatch) {
            console.log('\n⚠️  Password not hashed correctly. Fixing...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);
            admin.password = hashedPassword;
            await admin.save({ hooks: false }); // Skip hooks to avoid double hashing
            console.log('✅ Password updated successfully');

            // Test again
            const newMatch = await bcrypt.compare(plainPassword, admin.password);
            console.log('New match result:', newMatch ? '✅ PASS' : '❌ FAIL');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

testAuth();
