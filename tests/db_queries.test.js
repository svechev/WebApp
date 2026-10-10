const {describe, it, after} = require('node:test');
const assert = require('node:assert/strict');
const argon2 = require('argon2');

const {createUser, checkUser, deleteUser} = require('../helpers/db_queries');
const db = require('../helpers/db.js');

const newUsername = 'NewPerson';
const newEmail = 'NewEmail@gmail.com';
const newPassword = 'NewPassword1';

describe('database operations tests', () => {
    it('add user successfully, duplicate fails', async () => {
        const newPasswordHash = await argon2.hash(newPassword, { type: argon2.argon2id });
        const result = await createUser(newUsername, newEmail, newPasswordHash);
        assert.ok(result);

        await assert.rejects(createUser(newUsername, newEmail, newPasswordHash), {code: 'ER_DUP_ENTRY'});
    });

    it('check user test', async () => {
        const result = await checkUser(newUsername, newPassword);
        assert.equal(result, true);
    })

    after(async () => {
        try {
            await deleteUser(newUsername);
        }
        finally {
            db.end();
        }
    });
});

