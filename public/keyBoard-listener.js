export default function createKeyBoardListener() {
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId){
        state.playerId = playerId
    }

    function subscribe(observerFuction) {
        state.observers.push(observerFuction)
    }

    function unsubscribeAll(observerFunction) {
        state.observers = []
    }

    function notifyAll(command) {

        for (const observerFuction of state.observers) {
            observerFuction(command)
        }
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed,
        }
        notifyAll(command)
    }
    return {
        subscribe,
        registerPlayerId
    }
}