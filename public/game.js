export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function start(){
        const frequency = 5000

        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }

    function notifyAll(command){
        for (const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId,
            playerX,
            playerY
        })
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000000)
        const fruitX =  command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY =  command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                }
            },
            ArrowDown(player) {
                if (player.y + 1 <= 9) {
                    player.y = player.y + 1
                }
            },
            ArrowRight(player) {

                if (player.x + 1 <= 9) {
                    player.x = player.x + 1
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[command.playerId]
        const moveFuction = acceptedMoves[keyPressed]

        if (player && moveFuction) {
            moveFuction(player)
            checkForFruitcollision(playerId)
        }
    }

    function checkForFruitcollision(playerId) {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`checando ${playerId} e ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`colisão entre ${playerId} e ${fruitId}`)
                removeFruit({
                    fruitId
                })
            }
        }

    }

    return {
        addPlayer,
        addFruit,
        removeFruit,
        removePlayer,
        movePlayer,
        state,
        setState,
        subscribe,
        start
    }
}