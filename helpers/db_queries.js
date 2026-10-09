const db = require('./db.js');

async function createUser(user) {
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [user.username, user.email, user.password_hash]
    );

    return result;
}

module.exports = {createUser};