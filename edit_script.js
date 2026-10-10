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
    const error = validateProfileChanges(newUsername, newPassword, confirmPassword);
    if (error !== null) {
        const errorField = document.getElementById('edit-error');
        errorField.textContent = error;
        return;
    }

    // check the old password at some point

}

const editForm = document.getElementById('edit-form');
editForm.addEventListener('submit', submitEditHandler);
