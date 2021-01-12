const f1 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(1)
            resolve()
        }, 6000)
    })
}
const f2 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(2)
            const myObj = {name: 'Oskar', age: 24}
            resolve(myObj)
            let err = false
            if (err) throw new Error('Problem at f2()')
        }, 2000)
    })
}
const f3 = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(3)
            resolve()
        }, 5000)
    })
}

async function program() {
    try {
        await f1()
        const obj = await f2()
        console.log('moje imie to: ' + obj.name + ', a wiek to: ' + obj.age)
        await f3()
        console.log('done')
    } catch (e) { '[Error] ' + console.log(e.message) }

}


program()