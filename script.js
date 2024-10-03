let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = null;

// Función para registrar un usuario
function register() {
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    emailError.textContent = '';  
    passwordError.textContent = '';

    if (!email || !password) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    if (!isValidEmail(email)) {
        emailError.textContent = "Por favor, ingresa un email válido.";
        return;
    }

    if (password.length < 8) {
        passwordError.textContent = "La contraseña debe tener al menos 8 caracteres.";
        return;
    }

    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert("El email ya está registrado.");
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));  
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    toggleLogin();
}

// Función para validar email
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Función para iniciar sesión
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

    if (!user) {
        alert("Email o contraseña incorrectos.");
        return;
    }

    loggedInUser = user;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Alternar entre formularios
function toggleLogin() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

function toggleRegister() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
}

// Función para mostrar las pestañas
function showTab(event, tabName) {
    // Ocultar todas las pestañas
    const tabContents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none'; // Ocultar todas las pestañas
    }

    // Quitar la clase 'active' de todas las pestañas
    const tabLinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
    }

    // Mostrar la pestaña seleccionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block'; // Mostrar la pestaña seleccionada
    }

    // Añadir la clase 'active' a la pestaña seleccionada
    event.currentTarget.classList.add('active');
}

// Función para cerrar sesión
function logout() {
    loggedInUser = null;
    localStorage.removeItem('loggedInUser');  
    document.getElementById('userEmail').textContent = '';
    document.getElementById('app').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Función para realizar pagos
function makePayment() {
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert("Ingresa un monto válido.");
        return;
    }
    alert(`Pago realizado por $${amount.toFixed(2)}.`);
    document.getElementById('paymentStatus').textContent = `Pago realizado por $${amount.toFixed(2)}.`;
}
