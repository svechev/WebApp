function showError(errorId, errorText) {
    let errorField = document.getElementById(errorId);
    errorField.textContent = errorText;
}

function clearErrors() {
    let errorFields = document.getElementsByClassName("error");
    for (let i = 0; i < errorFields.length; i++) {
        errorFields[i].textContent = "";
    }
    let successField = document.getElementById("success");
    successField.textContent = "";  // clear the success field too just in case
}

function validateUserName(username) {
    if (username.length == 0) {
        showError('username-error', 'Потребителското име е задължително!');
        return false;
    }
    if (username.length > 32 || username.length < 3) {
        showError('username-error', 'Потребителското име трябва да съдържа от 3 до 32 символа!');
        return false;
    }
    return true;
}

function validateEmail(email) {
    if (email.length == 0) {
        showError('email-error', 'Имейл адресът е задължителен!');
        return false;
    }
    const emailFormat = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailFormat.test(email)) {
        showError('email-error', 'Невалиден имейл адрес!');
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (password.length == 0) {
        showError('password-error', 'Паролата е задължителна!');
        return false;
    }
    if (password.length < 8) {
        showError('password-error', 'Паролата трябва да е поне 8 символа!');
        return false;
    }
    const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9]$/;
    if (!passwordFormat.test(password)) {
        showError('password-error', 'В паролата трябва да има поне една главна и малка буква и цифра!');
        return false;
    }
    return true;
}

function validateData(username, email, password) {
    return validateUserName(username) && validateEmail(email) && validatePassword(password) ;
}

var submitHandler = async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    clearErrors();
    let validInput = validateData(username, email, password);
    if (!validInput) {
        return;
    }
    else {
        
    }

}

let submitButton = document.getElementById('register-btn');
submitButton.addEventListener('click', submitHandler);