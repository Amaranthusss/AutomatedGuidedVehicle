class ScannerJSON {
    constructor(name, id) {
        this.name = name
        this.output = []
        this.id = id
    }
}

const scannersList = [
    new ScannerJSON('Rear', 1),
    new ScannerJSON('Front', 2)
]

export default scannersList