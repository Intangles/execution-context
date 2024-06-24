const {
    provideExecutionContext,
    getExecutionContext,
    setExecutionContext
} = require("../");


const firstFunction = () => {
    console.log("first function")
    secondFunction()
}

/**
 * Changing context value in second function
 */
const secondFunction = () => {
    const contextValue = getExecutionContext();
    console.log("second function" , contextValue)
    setExecutionContext("new-context-value")
    thirdFunction()
}

const thirdFunction = () => {
    const contextValue = getExecutionContext();
    console.log("third function", contextValue)
}

const contextualFirstFunction = provideExecutionContext(firstFunction, "context-value")

contextualFirstFunction()