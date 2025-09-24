import { $ } from '../common.js';

const loginFn = () => {
    const loginForm = $('#loginForm');
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingDots = submitBtn.querySelector('.loading-dots');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        //Animation // Button loading animation
        btnText.style.display = 'none';
        loadingDots.style.display = 'inline-block';
        submitBtn.disabled = true;

        //user input value
        const email = $('#loginEmail').value;
        const password = $('#loginPassword').value;
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            //Animation// Reset button
            btnText.style.display = 'inline-block';
            loadingDots.style.display = 'none';
            submitBtn.disabled = false;
            //Animation
            
            if (data.success) {
                // Success animation
                submitBtn.classList.add('btn-success-cool');
                setTimeout(() => {
                    alert(` Welcome back ${data.user.firstName} ${data.user.lastName}!`);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    $('#contentContainer').innerHTML = `
                        <div class="text-center animate__animated animate__bounceIn"> 
                            <h2 class="lead">You have successfully logged in! Welcome, ${data.user.firstName}</h2>
                        </div>
                    `;
                }, 500);
            } else {
                // Error animation
                submitBtn.classList.add('btn-danger-cool');
                setTimeout(() => {
                    alert(`${data.message}`);
                    submitBtn.classList.remove('btn-danger-cool');
                }, 300);
            }
        } catch (error) {
            console.error('Error:', error);
            btnText.style.display = 'inline-block';
            loadingDots.style.display = 'none';
            submitBtn.disabled = false;
            alert('Login failed. Please try again.');
        }
    });

    // Animations// Add hover effects to inputs
    const inputs = loginForm.querySelectorAll('.form-control-cool');
    inputs.forEach(input => {
        input.addEventListener('mouseenter', () => {
            input.style.transform = 'scale(1.02)';
        });
        input.addEventListener('mouseleave', () => {
            input.style.transform = 'scale(1)';
        });
    });
};

export default loginFn;