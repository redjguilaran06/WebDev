document.addEventListener('DOMContentLoaded', function() {
    const userCountInput = document.getElementById('userCount');
    const nameFormatSelect = document.getElementById('nameFormat');
    const generateBtn = document.getElementById('generateBtn');
    const usersBody = document.getElementById('usersBody');
    const errorMessage = document.getElementById('errorMessage');
    
    function validUserCount() {
        const count = parseInt(userCountInput.value);
        if (isNaN(count) || count < 0 || count > 1000) {
            showError('Please enter a number between 0 and 1000');
            return false;
        }
        return true;
    }
    function userRows(users, nameFormat) {
        if (users.length === 0) {
            usersBody.innerHTML = '<tr><td colspan="4"><div class="loading">No users to display</div></td></tr>';
            return;
        }
        usersBody.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            const name = nameFormat === 'first' 
                ? `${user.name.first}` 
                : `${user.name.last}`;
            row.style.animationDelay = `${index * 0.05}s`;
            row.innerHTML = `
                <td><img src="${user.picture.thumbnail}" class="user-avatar" alt="User">${name}</td>
                <td>${user.gender}</td>
                <td>${user.email}</td>
                <td>${user.location.country}</td>
            `;
            usersBody.appendChild(row);
        });
    }
    async function fetchUsers(count) {
        try {
            usersBody.innerHTML = '<tr><td colspan="4"><div class="loading">Loading users...</div></td></tr>';
            generateBtn.disabled = true;
            const response = await fetch(`https://randomuser.me/api/?results=${count}`);
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            const data = await response.json();
            userRows(data.results, nameFormatSelect.value);
        } catch (error) {
            showError(`Failed to fetch users: ${error.message}`);
            usersBody.innerHTML = '<tr><td colspan="4"><div class="loading">Error loading users. Please try again.</div></td></tr>';
        } finally {
            generateBtn.disabled = false;
        }
    }
    generateBtn.addEventListener('click', function() {
        if (validUserCount()) {
            const count = parseInt(userCountInput.value);
            if (count === 0) {
                usersBody.innerHTML = '<tr><td colspan="4"><div class="loading">No users to display</div></td></tr>';
                return;
            }
            fetchUsers(count);
        }
    });
    nameFormatSelect.addEventListener('change', function() {
        if (usersBody.querySelector('tr:not(:only-child)')) {
            const count = parseInt(userCountInput.value);
            if (!isNaN(count) && count > 0) {
                fetchUsers(count);
            }
        }
    });

    userCountInput.addEventListener('change', validUserCount);
     function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
});