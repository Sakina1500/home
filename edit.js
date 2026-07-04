export function updatePlayer(currentTeamData, updatedPlayer) {
    const playerIndex = currentTeamData.players.findIndex(p => p.id === updatedPlayer.id);
    if (playerIndex !== -1) {
        const oldPos = currentTeamData.players[playerIndex].positionId;
        if (oldPos !== updatedPlayer.positionId) {
            const positionExists = currentTeamData.players.some(p => p.positionId === updatedPlayer.positionId);
            if (positionExists) {
                alert("Siz tanlagan yangi pozitsiya band!");
                return false;
            }
        }
        currentTeamData.players[playerIndex] = updatedPlayer;
        return true;
    }
    return false;
}

export function editTeamName(currentTeamData, newName) {
    if (newName && newName.trim() !== "") {
        currentTeamData.name = newName.trim();
        return true;
    }
    alert("Jamoa nomi bo'sh bo'lishi mumkin emas!");
    return false;
}
