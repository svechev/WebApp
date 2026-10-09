const crypto = require('crypto'); 

const captchaChallenges = new Map(); 

function generateCaptcha() { 
    const a = crypto.randomInt(1, 25); 
    const b = crypto.randomInt(1, 25); 
    const challengeId = crypto.randomUUID();
    captchaChallenges.set(challengeId, { answer: String(a + b), expiresAt: Date.now() + 60 * 1000 }); 
    return { challengeId, question: `${a} + ${b}` }; 
} 

function verifyCaptcha(challengeId, userAnswer) { 
    const challenge = captchaChallenges.get(challengeId); 

    captchaChallenges.delete(challengeId); 

    if (!challenge) { 
        return false; 
    } 
    if (Date.now() > challenge.expiresAt) { 
        return false; 
    } 
    return String(userAnswer) === challenge.answer;
 }

module.exports = { generateCaptcha, verifyCaptcha };