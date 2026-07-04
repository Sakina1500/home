import { addNewPlayer } from './add.js';
import { updatePlayer, editTeamName } from './edit.js';
import { deletePlayer } from './delete.js';

const STORAGE_KEY = 'football_team_data';

const defaultData = {
    id: "team_1",
    name: "O'zbekiston",
    players: []
};

let currentTeamData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

const pitch = document.querySelector('.football-pitch');
const teamNameDisplay = document.getElementById('team-name-display');

const playerModal = document.getElementById('player-modal');
const teamModal = document.getElementById('team-modal');
const modalTitle = document.getElementById('modal-title');
const btnDeletePlayer = document.getElementById('btn-delete-player');

const inpId = document.getElementById('input-player-id');
const inpName = document.getElementById('input-player-name');
const inpNumber = document.getElementById('input-player-number');
const selPosition = document.getElementById('select-player-position');
const inpAvatar = document.getElementById('input-player-avatar');
const inpClub = document.getElementById('input-player-club');
const inputTeamName = document.getElementById('input-team-name');

function renderTeam() {
    if (teamNameDisplay) teamNameDisplay.textContent = currentTeamData.name;

    const oldPlayers = pitch.querySelectorAll('.player');
    oldPlayers.forEach(p => p.remove());

    currentTeamData.players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = `player pos-${player.positionId}`; 
        
        const avatarImg = player.avatarUrl ? `<img src="${player.avatarUrl}">` : '👤';
        const clubImg = player.clubLogoUrl ? `<div class="club-logo"><img src="${player.clubLogoUrl}"></div>` : '';

        playerDiv.innerHTML = `
            <div class="avatar-container">
                <div class="player-number">${player.number}</div>
                <div class="avatar">${avatarImg}</div>
                ${clubImg}
            </div>
            <div class="name">${player.name}</div>
        `;

        playerDiv.setAttribute('onclick', `openEditModal(${JSON.stringify(player).replace(/"/g, '&quot;')})`);
        pitch.appendChild(playerDiv);
    });
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTeamData));
    renderTeam();
}

window.openEditModal = function(player) {
    modalTitle.textContent = "O'yinchini tahrirlash";
    btnDeletePlayer.classList.remove('hidden');

    inpId.value = player.id;
    inpName.value = player.name;
    inpNumber.value = player.number;
    selPosition.value = player.positionId;
    inpAvatar.value = player.avatarUrl || "";
    inpClub.value = player.clubLogoUrl || "";

    playerModal.classList.add('open');
};

window.openTeamModal = function() {
    inputTeamName.value = currentTeamData.name;
    teamModal.classList.add('open');
};

window.closeTeamModal = function() {
    teamModal.classList.remove('open');
};

window.handleSaveTeam = function() {
    const newName = inputTeamName.value;
    const success = editTeamName(currentTeamData, newName);
    if (success) {
        saveToStorage();
        teamModal.classList.remove('open');
    }
};

window.openAddPlayerModal = function() {
    modalTitle.textContent = "Yangi o'yinchi qo'shish";
    btnDeletePlayer.classList.add('hidden');

    inpId.value = "";
    inpName.value = "";
    inpNumber.value = "";
    inpAvatar.value = "";
    inpClub.value = "";

    playerModal.classList.add('open');
};

window.closePlayerModal = function() {
    playerModal.classList.remove('open');
};

window.handleSavePlayer = function() {
    const name = inpName.value.trim();
    const number = parseInt(inpNumber.value);
    const positionId = selPosition.value;
    const id = inpId.value.trim();

    if (!name || !number) {
        alert("Iltimos, ism va raqamni to'liq kiriting!");
        return;
    }

    const playerData = {
        id: id || 'p_' + Date.now(),
        name,
        number,
        positionId,
        avatarUrl: inpAvatar.value.trim(),
        clubLogoUrl: inpClub.value.trim()
    };

    if (id === "") {
        const success = addNewPlayer(currentTeamData, playerData);
        if (success) {
            saveToStorage();
            playerModal.classList.remove('open');
        }
    } else {
        const success = updatePlayer(currentTeamData, playerData);
        if (success) {
            saveToStorage();
            playerModal.classList.remove('open');
        }
    }
};

window.handleDeletePlayer = function() {
    if (confirm("Haqiqatan ham bu o'yinchini o'chirmoqchisiz?")) {
        currentTeamData = deletePlayer(currentTeamData, inpId.value);
        saveToStorage();
        playerModal.classList.remove('open');
    }
};

document.addEventListener('DOMContentLoaded', renderTeam);
