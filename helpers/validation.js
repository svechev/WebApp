function validateUserName(username) {
    if (username.length == 0) {
        return 'Потребителското име е задължително!';
    }
    if (username.length > 32 || username.length < 3) {
        return 'Потребителското име трябва да съдържа от 3 до 32 символа!';
    }
    return null;
}

function validateEmail(email) {
    if (email.length == 0) {
        return 'Имейл адресът е задължителен!';
    }
    const emailFormat = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailFormat.test(email)) {
        return 'Невалиден имейл адрес!';
    }
    return null;
}

function validatePassword(password) {
    if (password.length == 0) {
        return 'Паролата е задължителна!';
    }
    if (password.length < 8) {
        return 'Паролата трябва да е поне 8 символа!';
    }
    const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9]+$/;
    if (!passwordFormat.test(password)) {
        return 'В паролата трябва да има поне една главна и малка буква и цифра!';
    }
    return null;
}

module.exports = { validateUserName, validateEmail, validatePassword };