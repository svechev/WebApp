const {describe, it} = require('node:test');
const assert = require('node:assert/strict');

const { generateCaptcha, verifyCaptcha } = require('../helpers/captcha');

describe('captcha tests', () => {
    it('generate captcha with id and addition', () => {
        const captcha = generateCaptcha();
        const questionFormat = /^\d+ \+ \d+$/;

        assert.equal(typeof captcha.challengeId, 'string');
        assert.equal(questionFormat.test(captcha.question), true);
    });

    it('accept the correct CAPTCHA answer', () => {
        const captcha = generateCaptcha();
        const [a, b] = captcha.question.split(' + ').map(Number);

        assert.equal(verifyCaptcha(captcha.challengeId, String(a + b)), true);
    });

    it('reject incorrect answer', () => {
        const captcha = generateCaptcha();
        const [a, b] = captcha.question.split(' + ').map(Number);

        assert.equal(verifyCaptcha(captcha.challengeId, String(a + b + 1)), false);
    });

    it('reject using the same challenge twice', () => {
        const captcha = generateCaptcha();
        const [a, b] = captcha.question.split(' + ').map(Number);
        const answer = String(a + b);

        assert.equal(verifyCaptcha(captcha.challengeId, answer), true);
        assert.equal(verifyCaptcha(captcha.challengeId, answer), false);
    });

    it('reject unknown challenge ID', () => {
        assert.equal(verifyCaptcha('fakeId', '2'), false);
    });
});