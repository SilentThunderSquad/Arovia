const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixUsernames = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const users = await User.find({ 
            $or: [
                { username: { $exists: false } },
                { username: null },
                { username: "" }
            ]
        });

        console.log(`Found ${users.length} users without usernames.`);

        let updatedCount = 0;
        for (const user of users) {
             if (user.email) {
                const newUsername = user.email.split('@')[0];
                
                // Check if this username is already taken by another user (unlikely but good to check)
                const existing = await User.findOne({ username: newUsername });
                if (existing && existing._id.toString() !== user._id.toString()) {
                    console.log(`Skipping ${user.email} - username ${newUsername} already taken.`);
                    continue;
                }

                user.username = newUsername;
                await user.save();
                console.log(`Updated user: ${user.email} -> ${user.username}`);
                updatedCount++;
            } else {
                console.log(`Skipping user ${user._id} - No email found.`);
            }
        }

        console.log(`\nSuccess! Updated ${updatedCount} users.`);
        process.exit(0);

    } catch (error) {
        console.error('Error fixing usernames:', error);
        process.exit(1);
    }
};

fixUsernames();
