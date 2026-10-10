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

function validateData(username, email, password) {
    const usernameError = validateUserName(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (usernameError) {
        showError('username-error', usernameError);
        return false;
    }

    if (emailError) {
        showError('email-error', emailError);
        return false;
    }

    if (passwordError) {
        showError('password-error', passwordError);
        return false;
    }

    return !usernameError && !emailError && !passwordError;
}

var submitHandler = async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const captchaAnswer = document.getElementById('captcha').value;

    clearErrors();
    if (!challengeId) {
        showError('captcha-error', 'Липсва CAPTCHA въпрос.');
        return;
    }

    let validInput = validateData(username, email, password);
    if (!validInput) {
        return;
    }

    try {
        const response = await fetch('/api/register', { method: 'POST',
             headers: { 'Content-Type': 'application/json' }, 
             body: JSON.stringify({ username, email, password, captchaAnswer, captchaChallengeId: challengeId }) }); 
        const result = await response.json();

        if (!response.ok) { 
            showError('register-error', 'Грешка при регистрация!'); 
            await generateCaptcha();
            return; 
        }

        let successField = document.getElementById('success');
        successField.textContent = 'Успешна регистрация! Влезте през Вход';
    }
    catch (error) {
        showError('register-error', 'Грешка при свързване със сървъра.');
    }
}

async function generateCaptcha() { 
    console.log("Clicked captcha");
    const errorElement = document.getElementById('captcha-error'); 
    const questionElement = document.getElementById('captcha-question'); 
    
    errorElement.textContent = ''; 
    questionElement.textContent = ''; 

    challengeId = null; 
    try { 
        const response = await fetch('/api/captcha', { method: 'POST' }); 
        if (!response.ok) { 
            throw new Error('Could not generate CAPTCHA');
        } 
        
        const data = await response.json(); 
        challengeId = data.challengeId; 
        
        questionElement.textContent = data.question; 
    } 
    catch (error) { 
        showError('captcha-error', 'Грешка при генериране на въпроса.');
    } 
    
    finally { 
        captchaButton.disabled = false; 
    } 
}

let challengeId = null;

const captchaButton = document.getElementById('captcha-generator');
captchaButton.addEventListener('click', generateCaptcha);


const regForm = document.getElementById('reg-form');
regForm.addEventListener('submit', submitHandler);