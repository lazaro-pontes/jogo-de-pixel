export default function renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.clearRect(0, 0, 10, 10)

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'red'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    const currentPlayer = game.state.players[currentPlayerId]
    
    if(currentPlayer) {
        context.fillStyle = '#f0db4f'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    updateScoreTable(scoreTable, game, currentPlayerId)

    requestAnimationFrame(() => {
        renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId)
    })
}

function updateScoreTable(scoreTable, game, currentPlayerId){
    const maxResults = 10

    let scoreTableInnerHTML = `
        <thead>
            <tr class="header">
                <th>ID</th>
                <th>Name</th>
                <th>score</th>
            </tr>
        </thead>
    `

    const playersArray = []

    for (let socketId in game.state.players){
        const player = game.state.players[socketId]
        playersArray.push({
            playerId: socketId,
            x: player.x,
            y: player.y,
            name: player.name,
            score: player.score
        })
    }

    const playerSortedByScore = playersArray.sort((first, second) => {
        if (first.score < second.score) {
            return 1
        }

        if (second.score > first.score) {
            return -1
        }

        return 0
    })

    const topScorePlayers = playerSortedByScore.slice(0, maxResults)

    scoreTableInnerHTML = topScorePlayers.reduce((stringFormed, player) => {
        return stringFormed + `
            <tr ${player.playerId === currentPlayerId ? 'class="current-player"' : ''}>
                <td>${player.playerId}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            </tr>
        `
    }, scoreTableInnerHTML)

    const currentPlayerFromTopScore = topScorePlayers[currentPlayerId]

    if (currentPlayerFromTopScore) {
        scoreTableInnerHTML += `
            <tr class="current-player bottom">
                <td class="socket-id">${currentPlayerFromTopScore.id} EU </td>
                <td class="name-value">${currentPlayerFromTopScore.name}</td>
                <td class="score-value">${currentPlayerFromTopScore.score}</td>
            </tr>
        `
    }

    scoreTable.innerHTML = scoreTableInnerHTML
}