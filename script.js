// Simulación de base de datos local utilizando localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let teams = JSON.parse(localStorage.getItem('teams')) || [];
let players = JSON.parse(localStorage.getItem('players')) || [];
let matches = JSON.parse(localStorage.getItem('matches')) || [];
let loggedInUser = null;

// Función para registrar un usuario
function register() {
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    if (!email || !password) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Por favor, ingresa un email válido.");
        return;
    }

    if (password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert("El email ya está registrado.");
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));  // Guardar usuarios en localStorage
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    toggleLogin();
}

// Validar el formato del email
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
        // Limpiar los campos de entrada
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        return;
    }

    loggedInUser = user;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    loadTeams();  // Cargar equipos al iniciar sesión
    loadMatches();  // Cargar partidos al iniciar sesión
}

// Alternar a formulario de inicio de sesión
function toggleLogin() {
    const registration = document.getElementById('registration');
    const login = document.getElementById('login');

    if (registration) registration.style.display = 'none';
    if (login) login.style.display = 'block';
}

// Alternar a formulario de registro
function toggleRegister() {
    const registration = document.getElementById('registration');
    const login = document.getElementById('login');

    if (login) login.style.display = 'none';
    if (registration) registration.style.display = 'block';
}

// Función para mostrar las pestañas
function showTab(event, tabName) {
    const tabContents = document.getElementsByClassName('tabcontent');
    const tabLinks = document.getElementsByClassName('tablinks');

    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
    }

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    event.currentTarget.classList.add('active');
}

// Función para agregar equipos en la página de gestión
function addTeam() {
    const teamName = document.getElementById('teamName').value.trim();
    const teamColor = document.getElementById('teamColor').value;

    if (!teamName) {
        alert("Por favor, ingresa un nombre de equipo.");
        return;
    }

    // Verificar si el equipo ya existe
    if (teams.some(team => team.name.toLowerCase() === teamName.toLowerCase())) {
        alert("El equipo ya está registrado.");
        return;
    }

    teams.push({ name: teamName, color: teamColor, players: [], points: 0 });  // Agregar un array de jugadores vacío y puntos
    localStorage.setItem('teams', JSON.stringify(teams));  // Guardar equipos en localStorage
    alert(`Equipo ${teamName} agregado con éxito.`);

    updateTeamSelects();
    loadTeams();  // Actualizar la tabla de equipos en la página principal si está abierta
}

// Función para actualizar los selects de equipos
function updateTeamSelects() {
    const teamSelects = document.querySelectorAll('#playerTeam, #pointsTeam, #teamOne, #teamTwo');

    teamSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '';

        // Agregar una opción predeterminada
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione un equipo';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.name;
            option.textContent = team.name;
            select.appendChild(option);
        });

        // Restaurar la selección previa si es posible
        if (teams.some(team => team.name === selectedValue)) {
            select.value = selectedValue;
        }
    });
}

// Función para agregar un jugador
function addPlayer() {
    const playerName = document.getElementById('playerName').value.trim();
    const playerPosition = document.getElementById('playerPosition').value;
    const playerTeam = document.getElementById('playerTeam').value;

    if (!playerName || !playerTeam) {
        alert("Por favor, ingresa un nombre de jugador y selecciona un equipo.");
        return;
    }

    // Agregar jugador a la lista
    players.push({ name: playerName, position: playerPosition, team: playerTeam });
    localStorage.setItem('players', JSON.stringify(players));  // Guardar jugadores en localStorage
    alert(`Jugador ${playerName} agregado al equipo ${playerTeam}.`);

    // Agregar el jugador al equipo correspondiente
    const team = teams.find(t => t.name === playerTeam);
    if (team) {
        team.players.push(playerName);
        localStorage.setItem('teams', JSON.stringify(teams));  // Actualizar equipos en localStorage
        loadTeams();  // Actualizar la tabla de equipos en la página principal si está abierta
    }
}

// Función para sumar puntos a un equipo
function addPoints() {
    const teamName = document.getElementById('pointsTeam').value;
    const pointsInput = document.getElementById('pointsInput').value;

    const points = parseInt(pointsInput, 10);

    if (!teamName || isNaN(points) || points <= 0) {
        alert("Selecciona un equipo e ingresa un valor válido de puntos.");
        return;
    }

    // Encontrar el equipo y sumar los puntos
    const team = teams.find(t => t.name === teamName);
    if (!team) {
        alert("El equipo seleccionado no existe.");
        return;
    }

    team.points += points;
    localStorage.setItem('teams', JSON.stringify(teams));  // Actualizar equipos en localStorage
    alert(`Se sumaron ${points} puntos al equipo ${teamName}.`);

    loadTeams();  // Actualizar la tabla de equipos en la página principal si está abierta
}

// Función para agregar un partido en la página de gestión
function addMatch() {
    const matchDate = document.getElementById('matchDate').value;
    const matchLocation = document.getElementById('matchLocation').value.trim();
    const teamOne = document.getElementById('teamOne').value;
    const teamTwo = document.getElementById('teamTwo').value;

    if (!matchDate || !matchLocation || !teamOne || !teamTwo) {
        alert("Por favor, completa toda la información del partido.");
        return;
    }

    if (teamOne === teamTwo) {
        alert("Un equipo no puede jugar contra sí mismo.");
        return;
    }

    const match = {
        date: matchDate,
        location: matchLocation,
        teamOne,
        teamTwo
    };

    matches.push(match);
    localStorage.setItem('matches', JSON.stringify(matches));  // Guardar partidos en localStorage
    alert(`Partido entre ${teamOne} y ${teamTwo} agregado para la fecha ${matchDate} en ${matchLocation}.`);

    loadMatches();  // Actualizar la tabla de partidos en la página principal si está abierta
}

// Función para cargar equipos en la página principal
function loadTeams() {
    const classificationBody = document.getElementById('classificationBody');
    if (!classificationBody) return;  // Evitar errores si el elemento no existe

    classificationBody.innerHTML = '';  // Limpiar la tabla de clasificación

    teams.forEach(team => {
        const row = document.createElement('tr');
        const playersList = team.players.length > 0 ? team.players.join(', ') : '-';
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.points}</td>  <!-- Mostrar los puntos -->
            <td>${playersList}</td>  <!-- Mostrar los nombres de los jugadores -->
            <td>
                <button onclick="joinTeam('${team.name}')">Unirse</button>
                <button onclick="leaveTeam('${team.name}')">Abandonar</button>
            </td>
        `;
        classificationBody.appendChild(row);
    });
}

// Función para cargar partidos en la página principal
function loadMatches() {
    const matchesBody = document.getElementById('matchesBody');
    if (!matchesBody) return;  // Evitar errores si el elemento no existe

    matchesBody.innerHTML = '';  // Limpiar la tabla de partidos

    matches.forEach(match => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${match.date}</td>
            <td>${match.location}</td>
            <td>${match.teamOne} vs ${match.teamTwo}</td>
        `;
        matchesBody.appendChild(row);
    });
}

// Función para unirse a un equipo
function joinTeam(teamName) {
    if (!loggedInUser) {
        alert("Por favor, inicia sesión para unirte a un equipo.");
        return;
    }

    if (isUserInAnyTeam()) {
        alert("Ya eres miembro de un equipo. Debes abandonar tu equipo actual antes de unirte a otro.");
        return;
    }

    const team = teams.find(t => t.name === teamName);
    if (!team) {
        alert("El equipo seleccionado no existe.");
        return;
    }

    team.players.push(loggedInUser.email);  // Usar email como identificador único
    localStorage.setItem('teams', JSON.stringify(teams));  // Actualizar en localStorage
    alert(`Te has unido al equipo ${teamName}.`);
    loadTeams();  // Recargar los equipos para actualizar la tabla
}

// Función para abandonar un equipo
function leaveTeam(teamName) {
    if (!loggedInUser) {
        alert("Por favor, inicia sesión para abandonar un equipo.");
        return;
    }

    const team = teams.find(t => t.name === teamName);
    if (!team) {
        alert("El equipo seleccionado no existe.");
        return;
    }

    const index = team.players.indexOf(loggedInUser.email);
    if (index === -1) {
        alert("No eres miembro de este equipo.");
        return;
    }

    team.players.splice(index, 1);  // Remover el usuario del equipo
    localStorage.setItem('teams', JSON.stringify(teams));  // Actualizar en localStorage
    alert(`Has abandonado el equipo ${teamName}.`);
    loadTeams();  // Recargar los equipos para actualizar la tabla
}

// Función para verificar si el usuario ya está en un equipo
function isUserInAnyTeam() {
    if (!loggedInUser) return false;
    return teams.some(team => team.players.includes(loggedInUser.email));
}

// Función para agregar una imagen
function addImage() {
    const imageInput = document.getElementById('imageInput').files[0];

    if (!imageInput) {
        alert("Selecciona una imagen para cargar.");
        return;
    }

    // Simulación de carga de imagen (aquí debería implementarse la lógica de subida real)
    alert(`Imagen ${imageInput.name} cargada con éxito.`);
}

// Función para realizar pagos (simulado)
function makePayment() {
    const amountInput = document.getElementById('paymentAmount').value;
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount <= 0) {
        alert("Ingresa un monto válido.");
        return;
    }

    // Simulación de pago: podría guardar en localStorage si es necesario
    alert(`Pago realizado por $${amount.toFixed(2)}.`);
    document.getElementById('paymentStatus').textContent = `Pago realizado por $${amount.toFixed(2)}.`;
}

// Event listener para cargar equipos y partidos al cargar la página si ya está abierta
document.addEventListener('DOMContentLoaded', function() {
    // Si el usuario ya está logueado (persistencia del login no implementada)
    // Cargar equipos y partidos si el usuario está en la página principal
    if (document.getElementById('classificationBody')) {
        loadTeams();
    }

    if (document.getElementById('matchesBody')) {
        loadMatches();
    }

    // Actualizar los selects de equipos en la página de gestión
    if (document.getElementById('gestion')) {
        updateTeamSelects();
    }
});
