const {describe, it} = require('node:test');
const assert = require('node:assert/strict');

const { validateUserName, validateEmail, validatePassword} = require('../helpers/validation.js');

const validName = "Mahiro";
const validEmail = "example@gmail.com";
const validPassword = "Password1";


describe('username tests', () => {
    it("valid username", () => {
        assert.equal(validateUserName(validName), null);
    })

    it("empty username", () => {
        assert.equal(validateUserName(''), 'Потребителското име е задължително!');
    })

    it("short username", () => {
        assert.equal(validateUserName('A'), 'Потребителското име трябва да съдържа от 3 до 32 символа!');
    })

    it("long username", () => {
        assert.equal(validateUserName("abcdefghijABCDEFGHIJabcdefghijklmnopq"), 'Потребителското име трябва да съдържа от 3 до 32 символа!');
    })
});

describe('email tests', () => {
    it("valid password", () => {
        assert.equal(validateEmail(validEmail), null);
    })
    
    it("empty email", () => {
        assert.equal(validateEmail(''), 'Имейл адресът е задължителен!');
    })
    
    it("invalid email", () => {
        assert.equal(validateEmail("missing.at.symbol"), 'Невалиден имейл адрес!');
    })
});

describe('password tests', () => {
    it("valid password", () => {
        assert.equal(validatePassword(validPassword), null);
    })

    it("empty password", () => {
        assert.equal(validatePassword(''), 'Паролата е задължителна!');
    })

    it("short password", () => {
        assert.equal(validatePassword('As2'), 'Паролата трябва да е поне 8 символа!');
    })

    it("password without numbers", () => {
        assert.equal(validatePassword("Password"), 'В паролата трябва да има поне една главна и малка буква и цифра!');
    })
});