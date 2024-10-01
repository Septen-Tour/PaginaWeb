let users = [];
let teams = [];

// Registro de usuarios
function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (email && password) {
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registro exitoso. Ahora inicie sesión.');
        document.getElementById('registration').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

// Inicio de sesión
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        localStorage.setItem('userEmail', email);
        document.getElementById('userEmail').textContent = email;
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        showTab('perfil');
        updateClassification(); // Actualizar clasificación al iniciar sesión
    } else {
        alert('Email o contraseña incorrectos.');
    }
}

// Mostrar pestañas
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tabcontent');
    tabs.forEach(tab => tab.style.display = 'none');

    document.getElementById(tabName).style.display = 'block';
}

// Agregar equipo
function addTeam() {
    const teamName = document.getElementById('teamName').value;
    const teamColor = document.getElementById('teamColor').value;

    if (teamName) {
        teams.push({ name: teamName, color: teamColor, players: [], points: 0 });
        updateTeamSelects();
        updateClassification(); // Actualiza la clasificación
        document.getElementById('teamName').value = ''; // Limpiar campo
    } else {
        alert('Por favor, ingrese un nombre para el equipo.');
    }
}

// Unirse a un equipo
function joinTeam(teamName) {
    const userEmail = localStorage.getItem('userEmail'); // Obtener el email del usuario

    if (!userEmail) {
        alert('Por favor, inicie sesión primero.');
        return;
    }

    const team = teams.find(t => t.name === teamName);
    
    if (team) {
        // Verificar si el usuario ya está en un equipo
        const userTeam = teams.find(t => t.players.includes(userEmail));
        if (userTeam) {
            alert(`Ya te has unido al equipo ${userTeam.name}. Puedes unirte a otro equipo solo si abandonas este.`);
            return;
        }

        if (team.players.includes(userEmail)) { // Verificar si el usuario ya está en el equipo
            alert('Ya te has unido a este equipo.');
        } else if (team.players.length < 8) { // Verificar si el equipo no está lleno
            team.players.push(userEmail); // Agregar al usuario al equipo
            alert(`${userEmail} se ha unido al equipo ${teamName}.`);
            updateClassification(); // Actualizar clasificación
        } else {
            alert(`El equipo ${teamName} ya está completo.`);
        }
    }
}

// Actualizar selección de equipos
function updateTeamSelects() {
    const playerTeamSelect = document.getElementById('playerTeam');
    const pointsTeamSelect = document.getElementById('pointsTeam');
    const teamOneSelect = document.getElementById('teamOne');
    const teamTwoSelect = document.getElementById('teamTwo');

    playerTeamSelect.innerHTML = '';
    pointsTeamSelect.innerHTML = '';
    teamOneSelect.innerHTML = '';
    teamTwoSelect.innerHTML = '';

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.name;
        option.textContent = team.name;
        playerTeamSelect.appendChild(option.cloneNode(true));
        pointsTeamSelect.appendChild(option.cloneNode(true));
        teamOneSelect.appendChild(option.cloneNode(true));
        teamTwoSelect.appendChild(option.cloneNode(true));
    });
}

// Actualizar clasificación
function updateClassification() {
    const classificationBody = document.getElementById('classificationBody');
    classificationBody.innerHTML = ''; // Limpiar tabla

    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.points || 0}</td>
            <td>${team.players.join(', ') || 'No hay jugadores'}</td>
            <td>
                <button onclick="joinTeam('${team.name}')">Unirse</button>
                <button onclick="leaveTeam('${team.name}')">Abandonar</button>
            </td>
        `;
        classificationBody.appendChild(row);
    });

    updateTeamSelectors(); // Actualizar selectores de equipo
}

// Abandonar equipo
function leaveTeam(teamName) {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        alert('Por favor, inicie sesión primero.');
        return;
    }

    const team = teams.find(t => t.name === teamName);
    
    if (team && team.players.includes(userEmail)) {
        team.players = team.players.filter(player => player !== userEmail); // Remover al usuario del equipo
        alert(`${userEmail} ha abandonado el equipo ${teamName}.`);
        updateClassification(); // Actualizar clasificación
    } else {
        alert('No estás en este equipo o el equipo no existe.');
    }
}
// Agregar jugador
function addPlayer() {
    const playerName = document.getElementById('playerName').value;
    const playerPosition = document.getElementById('playerPosition').value;
    const playerTeam = document.getElementById('playerTeam').value;

    const team = teams.find(t => t.name === playerTeam);
    if (team && playerName) {
        if (team.players.length < 8) { // Verificar límite de jugadores
            team.players.push(playerName);
            alert(`${playerName} ha sido agregado al equipo ${playerTeam}.`);
            document.getElementById('playerName').value = ''; // Limpiar campo
        } else {
            alert(`El equipo ${playerTeam} ya está completo.`);
        }
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

// Agregar puntos
function addPoints() {
    const points = parseInt(document.getElementById('pointsInput').value);
    const teamName = document.getElementById('pointsTeam').value;

    const team = teams.find(t => t.name === teamName);
    if (team && !isNaN(points)) {
        team.points += points;
        updateClassification(); // Actualizar clasificación
        document.getElementById('pointsInput').value = ''; // Limpiar campo
    } else {
        alert('Por favor, complete todos los campos y asegúrese de que los puntos son válidos.');
    }
}

// Agregar partido
function addMatch() {
    const matchDate = document.getElementById('matchDate').value;
    const matchLocation = document.getElementById('matchLocation').value;
    const teamOne = document.getElementById('teamOne').value;
    const teamTwo = document.getElementById('teamTwo').value;

    const matchesBody = document.getElementById('matchesBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${matchDate}</td>
        <td>${matchLocation}</td>
        <td>${teamOne} vs ${teamTwo}</td>
    `;
    matchesBody.appendChild(row);
}

// Agregar imagen
function addImage() {
    const imageInput = document.getElementById('imageInput');
    const file = imageInput.files[0];

    if (file) {
        const photoGallery = document.getElementById('photoGallery');
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.style.width = '100px'; // Ajustar el tamaño de las imágenes
            img.style.margin = '5px';
            photoGallery.appendChild(img);
        };
        reader.readAsDataURL(file);
        imageInput.value = ''; // Limpiar el input
    } else {
        alert('Por favor, seleccione una imagen.');
    }
}

// Limpiar localStorage al salir
window.onbeforeunload = function() {
    localStorage.removeItem('userEmail');
};
// Simulación de pago
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cardHolderName = document.getElementById('cardHolderName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    if (cardHolderName && cardNumber && expiryDate && cvv) {
        document.getElementById('paymentStatus').innerText = "Pago realizado con éxito.";
    } else {
        document.getElementById('paymentStatus').innerText = "Error en el pago. Por favor, verifica los datos.";
    }
});
