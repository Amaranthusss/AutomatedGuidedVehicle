class Module {
    constructor(name, pinout) {
        this.name = name
        this.hardware = { pinout: pinout }
        this.id = Module.ids++
        this.state = 'uninitialized'
        Modules.ids.push({ id: this.id, name: this.name })
    }
    _sayHi() {
        console.log(`[${this.name} $[this.constructor.name]: ${this.id}] has been initialized`)
    }
    _message(msg) {
        console.log(`[${this.name} $[this.constructor.name]: ${this.id}] ${msg}`)
        return msg
    }
    print() {
        console.log(this.name, this.constructor.name, this.id, this.hardware)
    }
    printBody() {
        console.log(JSON.stringify(this)
            .replace(/{|}|"/g, '')
            .replace(/,/g, '\n')
            .replace(/:/g, ': ')
        )
    }
}
Module.ids = 1

const Modules = {
    show: () => console.log(`AGV's modules`, Modules.ids),
    ids: []
}

module.exports = {
    Module: Module,
    Modules: Modules
}