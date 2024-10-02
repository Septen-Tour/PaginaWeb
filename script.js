// Simulación de base de datos local
let users = [];
let loggedInUser = null;

// Función para registrar un usuario
function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Verificar si el email ya está registrado
    if (users.some(user => user.email === email)) {
        alert("El email ya está registrado.");
        return;
    }

    // Agregar nuevo usuario
    users.push({ email, password });
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    toggleLogin();  // Mostrar pantalla de inicio de sesión
}

// Función para iniciar sesión
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Verificar si el usuario existe
    const user = users.find(user => user.email === email && user.password === password);
    
    if (!user) {
        alert("Email o contraseña incorrectos.");
        return;
    }

    // Iniciar sesión
    loggedInUser = user;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
}

// Alternar a formulario de inicio de sesión
function toggleLogin() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

// Alternar a formulario de registro
function toggleRegister() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
}

// Función para mostrar las pestañas
function showTab(tabName) {
    const tabContents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }
    document.getElementById(tabName).style.display = 'block';
}

// Función para realizar pagos (simulado)
function makePayment() {
    const amount = document.getElementById('paymentAmount').value;
    if (amount > 0) {
        document.getElementById('paymentStatus').textContent = `Pago realizado por $${amount}.`;
    } else {
        document.getElementById('paymentStatus').textContent = "Ingresa un monto válido.";
    }
}
