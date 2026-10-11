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
        'SELECT id, password_hash FROM users WHERE username = ?',
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

    return rows[0].id;
}

async function getUserById(userId) {
    const [rows] = await db.execute(
        'SELECT id, username FROM users WHERE id = ?',
        [userId]
    );

    if (rows.length === 1) {
        return rows[0];
    }
    else {
        return null;
    }
}

async function editUser(oldUsername, newUsername, newPassword) {
    let query = '';
    let parameters = null;
    let passwordHash = '';
    if (newPassword !== '') {
        passwordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
    }

    if (newUsername === '') {
        query = 'UPDATE users SET password_hash = ? WHERE username = ?';
        parameters = [passwordHash, oldUsername];
    }
    else if (newPassword === '') {
        query = 'UPDATE users SET username = ? WHERE username = ?';
        parameters = [newUsername, oldUsername];
    }
    else { // update both
        query = 'UPDATE users SET username = ?, password_hash = ? WHERE username = ?';
        parameters = [newUsername, passwordHash, oldUsername];
    }

    const [result] = await db.execute(query, parameters);
    return result;
}

// function only used in testing
async function deleteUser(username) {
    const [result] = await db.execute(
        'DELETE FROM users WHERE username = ?',
        [username]
    );

    return result;
}

module.exports = {createUser, checkUser, deleteUser, getUserById, editUser};