const {describe, it, after} = require('node:test');
const assert = require('node:assert/strict');
const argon2 = require('argon2');

const {createUser, checkUser, deleteUser, editUser, getUserById} = require('../helpers/db_queries');
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

    it('check user successful', async () => {
        const resultId = await checkUser(newUsername, newPassword);
        assert.equal(resultId > 0, true);
    });

    it('check user with wrong username', async () => {
        assert.rejects(checkUser(newUsername + "SOMELETTERS", newPassword));
    });

    it('check user with wrong password', async () => {
        assert.rejects(checkUser(newUsername, newPassword + 'A'));
    });

    it('get user by id test', async () => {
        const user = await getUserById(1);
        assert.equal(user.username, 'Mahiro');
    });

    it('edit user tests', async () => {
        const changedUsername = "NewPerson2";
        const changedPassword = "NewPassword2";
        let result = await editUser(newUsername, changedUsername, '');
        assert.ok(result);

        result = await editUser(changedUsername, '', changedPassword);
        assert.ok(result);

        result = await editUser(changedUsername, newUsername, newPassword);
        assert.ok(result);
    });

    after(async () => {
        try {
            await deleteUser(newUsername);
        }
        finally {
            db.end();
        }
    });
});

