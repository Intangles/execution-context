const {
    provideExecutionContext,
    getExecutionContext
} = require("../");


const firstFunction = (param) => {
    console.log("first function", param)
    secondFunction(20)
}

const secondFunction = (param) => {
    console.log("second function", param)
    thirdFunction(30)
}

const thirdFunction = (param) => {
    const contextValue = getExecutionContext();
    console.log("third function", param, contextValue)
}
const contextualFirstFunction = provideExecutionContext(firstFunction, "context-value")

contextualFirstFunction(10)