async function loadWelcomeMessage() {
    try {
        const response = await fetch('/api/user');

        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error('Error loading user information');
        }

        const user = await response.json();

        const welcomeHeader = document.getElementById('welcome');
        welcomeHeader.textContent = `Здравей, ${user.username}!`;
    } catch (error) {
        console.log(error.message);
    }
}

const logoutHandler = async function() {
    try {
        const response = await fetch('/api/logout', { method: 'POST'}); 
        
        if (response.ok) {
            window.location.href = '/login';
        }
        else {
            console.log('Грешка при излизане!'); 
            return; 
        }
        
    }
    catch (error) {
        console.log('Грешка при свързване със сървъра.');
    }
}

loadWelcomeMessage();

const logoutButton = document.getElementById('logout-btn');
logoutButton.addEventListener('click', logoutHandler);
