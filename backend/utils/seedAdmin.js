const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created (admin@gmail.com / admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  }
};

module.exports = seedAdmin;
