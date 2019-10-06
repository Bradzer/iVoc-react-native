import { decorate, observable } from "mobx"

class Test {
    myVar = 0
}

decorate(Test, {
    myVar: observable
})
const storeTest = new Test()

export default storeTest