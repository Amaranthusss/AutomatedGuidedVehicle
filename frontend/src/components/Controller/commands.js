import axios from 'axios'

const commands = {
    states: [
        { state: false, ref: '/upCmd', lastType: '' },
        { state: false, ref: '/downCmd', lastType: '' },
        { state: false, ref: '/leftCmd', lastType: '' },
        { state: false, ref: '/rightCmd', lastType: '' },
        { state: false, ref: '/maxSpeedCmd', lastType: '' }
    ],
    _keyboardHandler: async e => { //Key events have intervals so there was required transfer limit
        let id, object
        switch (e.key) { //One handler to all specified keys
            case 'w': id = 0; break
            case 's': id = 1; break
            case 'a': id = 2; break
            case 'd': id = 3; break
            case 'Shift': id = 4; break
            default: return //Able to use only specified above keys
        }
        object = commands.states[id] //Pick suitable state
        if (e.type === 'keydown')
            object.state = true
        else object.state = false
        if (object.lastType != e.type) //Command has to be different than previous
            axios.post(object.ref, { state: object.state })
        object.lastType = e.type //Backup current state
    },
    _buttonHandler: async e => {
        let id, object
        switch (e.target.id) { //One handler to all controller's buttons
            case 'upBttn': id = 0; break
            case 'downBttn': id = 1; break
            case 'leftBttn': id = 2; break
            case 'rightBttn': id = 3; break
        }
        object = commands.states[id] //Pick suitable state
        if (e.type === 'mousedown')
            object.state = true
        else object.state = false
        await axios.post(object.ref, { state: object.state })
    },
    _voiceHandler: async cmd => {
        console.log('cmd', cmd)
        let response
        switch (cmd.toLowerCase()) {
            case 'jedź': case 'przed siebie': case 'przód': case 'prosto': case 'do przodu': case 'jedź przed siebie':
                response = 'jadę prosto'
                await axios.post('/upCmd', { state: true }); break
            case 'skręć w lewo': case 'lewo': case 'w lewo':
                response = 'skręcam w lewo'
                await axios.post('/leftCmd', { state: true }); break
            case 'skręć w prawo': case 'prawo': case 'w prawo':
                response = 'skręcam w prawo'
                await axios.post('/rightCmd', { state: true }); break
            case 'cofaj': case 'tył': case 'do tyłu':
                response = 'cofam'
                await axios.post('/downCmd', { state: true }); break
            case 'stop': case 'zatrzymaj się': case 'stój': case 'nie ruszaj się':
                response = 'zatrzymuję się'
                await axios.post('/upCmd', { state: false })
                await axios.post('/leftCmd', { state: false })
                await axios.post('/rightCmd', { state: false })
                await axios.post('/downCmd', { state: false })
                break
        } //await before axioses blocks response speech text without answer
        if (response === undefined) response = 'nie rozumiem'
        return response
    },
    readOut: async message => {
        const speech = new SpeechSynthesisUtterance()
        speech.text = await commands._voiceHandler(message)
        speech.volume = 1
        speech.rate = 1
        speech.pitch = 1
        speech.lang = 'pl-PL'
        window.speechSynthesis.speak(speech)
    }
}
export default commands