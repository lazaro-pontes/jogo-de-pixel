import express from 'express'
import http from 'http'
import createGame from "./public/game.js"
import io from 'socket.io'
import { Socket } from 'dgram'

const app = express()
const server = http.createServer(app)
const sockets = io(server)
const game = createGame()
game.start()

game.subscribe((command) => {
    console.log(`> emitindo ${command.type}`)
    sockets.emit(command.type, command)
})

app.use(express.static('public'))

sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> player conectado no servidor com ID: ${playerId}`)

    game.addPlayer({playerId})
    console.log(game.state)
    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId})
        console.log(`> player desconectado, ID: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})

server.listen(3000, () => {
    console.log("ouvindo na porta 3000")
})