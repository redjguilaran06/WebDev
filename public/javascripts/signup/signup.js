import { $ } from '../common.js';

const signupFn = () => {
    const signupForm = $('#signupForm');
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingDots = submitBtn.querySelector('.loading-dots');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = $('#firstName').value;
        const lastName = $('#lastName').value;
        const email = $('#signupEmail').value;
        const password = $('#signupPassword').value;
        const repassword = $('#repassword').value;
        
        if (password !== repassword) {
            // Shake animation for error
            $('#repassword').classList.add('animate__animated', 'animate__headShake');
            setTimeout(() => {
                $('#repassword').classList.remove('animate__animated', 'animate__headShake');
            }, 1000);
            alert('Passwords do not match!');
            return;
        }
        
        //Animation// Button loading animation
        btnText.style.display = 'none';
        loadingDots.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, repassword }),
            });
            
            const data = await response.json();
            
            // Reset button
            btnText.style.display = 'inline-block';
            loadingDots.style.display = 'none';
            submitBtn.disabled = false;
            
            if (data.success) {
                // Success animation
                submitBtn.classList.add('btn-success-cool');
                setTimeout(() => {
                    alert(' Registration successful! Please login.');
                    window.dispatchEvent(new CustomEvent('switchToLogin'));
                }, 600);
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
            alert('Registration failed. Please try again.');
        }
    });

    // Password checking if repassword is correct
    const passwordInput = $('#signupPassword');
    const repasswordInput = $('#repassword');
    
    [passwordInput, repasswordInput].forEach(input => {
        input.addEventListener('input', () => {
            if (passwordInput.value && repasswordInput.value) {
                if (passwordInput.value === repasswordInput.value) {
                    repasswordInput.style.borderColor = '#56ab2f';
                } else {
                    repasswordInput.style.borderColor = '#ff6b6b';
                }
            }
        });
    });
};

export default signupFn;