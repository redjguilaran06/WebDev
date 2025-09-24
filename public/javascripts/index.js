import { $ } from './common.js';
import loginFn from './login/login.js';
import signupFn from './signup/signup.js';

// Load login page
$('#loginPageBtn').addEventListener('click', () => {
    fetch('./templates/login.html')
        .then((response) => response.text())
        .then((fragments) => {
            $('#contentContainer').innerHTML = fragments;
            // Wait for DOM to be updated before attaching event listeners
            setTimeout(() => {
                loginFn();
            }, 0);
        })
        .catch(error => {
            console.error('Error loading login page:', error);
        });
});

// Load signup 
$('#signupPageBtn').addEventListener('click', () => {
    fetch('./templates/signup.html')
        .then((response) => response.text())
        .then((fragments) => {
            $('#contentContainer').innerHTML = fragments;
            // Wait for DOM to be updated before attaching event listeners
            setTimeout(() => {
                signupFn();
            }, 0);
        })
        .catch(error => {
            console.error('Error loading signup page:', error);
        });
});

// Nav between pages
window.addEventListener('switchToSignup', () => {
    console.log('Received switchToSignup event');
    $('#signupPageBtn').click();
});

window.addEventListener('switchToLogin', () => {
    console.log('Received switchToLogin event');
    $('#loginPageBtn').click();
});

// Load the page
$('#contentContainer').innerHTML;