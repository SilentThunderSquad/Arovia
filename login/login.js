const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const statusMessage = document.getElementById('statusMessage');

togglePassword.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePassword.textContent = isHidden ? 'Hide' : 'Show';
  togglePassword.setAttribute('aria-pressed', isHidden);
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const { identity, password } = event.target.elements;

  if (!identity.value || !password.value) {
    displayMessage('Please fill out every field to continue.');
    return;
  }

  displayMessage('Great! We are checking your credentials...');
  setTimeout(() => {
    displayMessage('All set! Redirecting you to the dashboard.');
  }, 1200);
});

function displayMessage(text) {
  statusMessage.textContent = text;
  statusMessage.style.opacity = '1';
  clearTimeout(displayMessage.timeout);
  displayMessage.timeout = setTimeout(() => {
    statusMessage.style.opacity = '0';
  }, 3200);
}