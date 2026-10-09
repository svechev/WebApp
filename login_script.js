function showError(errorId, errorText) {
    let errorField = document.getElementById(errorId);
    errorField.textContent = errorText;
}

var submitHandler = async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const response = await fetch('/api/login', { method: 'POST',
             headers: { 'Content-Type': 'application/json' }, 
             body: JSON.stringify({ username, password }) }); 
        const result = await response.json();

        if (response.ok) {
            window.location.href = '/home';
        }
        else {
            showError('login-error', 'Грешка при влизане!'); 
            return; 
        }

    }
    catch (error) {
        showError('login-error', 'Грешка при свързване със сървъра.');
    }
}

const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', submitHandler);