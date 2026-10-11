function clearErrorField() {
    const errorField = document.getElementById('edit-error');
    errorField.textContent = '';
}

function validateProfileChanges(newUsername, newPassword, confirmPassword) {
    if (newUsername !== '') {
        const usernameError = validateUserName(newUsername);

        if (usernameError) return usernameError;
    }

    if (newPassword !== '') {
        const passwordError = validatePassword(newPassword);

        if (passwordError) return passwordError;

        if (newPassword !== confirmPassword) {
            return 'Новите пароли не съвпадат!';
        }
    } 
    else if (confirmPassword !== '') {
        return 'Въведете нова парола!';
    }

    return null;
}

const submitEditHandler = async function(e) {
    e.preventDefault();

    const oldPassword = document.getElementById('current-password').value.trim();
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    clearErrorField();
    const errorField = document.getElementById('edit-error');
    const error = validateProfileChanges(newUsername, newPassword, confirmPassword);
    
    if (error !== null) {
        errorField.textContent = error;
        return;
    }

    try {
        const response = await fetch('/api/edit', { method: 'PUT',
             headers: { 'Content-Type': 'application/json' }, 
             body: JSON.stringify({ oldPassword, newUsername, newPassword }) }); 

        if (!response.ok) {
            if (response.status == 403) {
                errorField.textContent = 'Неправилна парола!';
            }
            else if (response.status == 401) {
                window.location.href = '/login';
            }
            else {
                errorField.textContent = 'Грешка при промяна';
            }

            return;
        }
    }
    catch (error) {
        errorField.textContent = 'Грешка при свързване със сървъра.';
    }

    const successField = document.getElementById('success');
    successField.textContent = 'Успешно променени данни!';
}

const editForm = document.getElementById('edit-form');
editForm.addEventListener('submit', submitEditHandler);
