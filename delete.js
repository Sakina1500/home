function deletePlayer(teamData, playerId) {
    teamData.players = teamData.players.filter(p => p.id !== playerId);
    return teamData;
}

export { deletePlayer };
