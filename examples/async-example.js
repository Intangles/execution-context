const {
    provideExecutionContext,
    getExecutionContext
} = require("../");


const firstFunction = async () => {
    console.log("first function")
    await delay(1000)
    // await needs to be there to make sure the context is available
    await secondFunction()
}

const secondFunction = async () => {
    console.log("second function")
    await delay(1000)
    // await needs to be there to make sure the context is available
    await thirdFunction()
}

const thirdFunction = () => {
    const contextValue = getExecutionContext();
    console.log("third function", contextValue)
}
const contextualFirstFunction = provideExecutionContext(firstFunction, "context-value")

contextualFirstFunction()

async function delay(ms) {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}