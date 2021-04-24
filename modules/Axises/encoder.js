class Encoder {
    constructor(axis, upButton, downButton) {
        this.axis = axis
        this.upButton = upButton
        this.downButton = downButton
        this.c = 0
        this.upButton.on('up', () => {
            this.c++
            this.getPosition()
        })

        this.downButton.on('up', () => {
            this.c--
            this.getPosition()
        })
    }
    getPosition() { this.axis._message(`Encoder at position ${this.c}.`) }
}
module.exports = Encoder