const argon2 = require('argon2');
const db = require('./db.js');

async function createUser(username, email, password_hash) {
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, password_hash]
    );

    return result;
}

async function checkUser(username, password) {
    const [rows] = await db.execute(
        'SELECT password_hash FROM users WHERE username = ?',
        [username]
    );

    if (rows.length === 0) {
        throw new Error('Invalid username or password');
    }
    const password_hash = rows[0].password_hash;

    const valid = await argon2.verify(password_hash, password);

    if (!valid) {
        throw new Error('Invalid username or password');
    }

    return true;
}

// function only used in testing
async function deleteUser(username) {
    const [result] = await db.execute(
        'DELETE FROM users WHERE username = ?',
        [username]
    );

    return result;
}


module.exports = {createUser, checkUser, deleteUser};