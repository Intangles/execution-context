# execution-context
## Description
Easier way to add and access context to your nested javascript functions
## Installation
```bash
npm install @intangles-lab/execution-context-js
```

## Usage
```javascript
const {
    provideExecutionContext,
    getExecutionContext
} = require("@intangles-lab/execution-context-js");


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
```

## API
### provideExecutionContext(fn, context)
- `fn` - Function to be executed
- `context` - Context value to be provided to the function
- Returns a function that can be executed with the provided context
- The provided context can be accessed using `getExecutionContext` function

### getExecutionContext()
- Returns the context value provided to the function
- If no context is provided, it returns `null`

### setExecutionContext(context)
- `context` - Context value to be set
- Sets the context value to be provided to the function

## Caveats
The context value is only available to the functions that are available in the same call stack as the function that is provided with the context value. Due to the nature of javascript, callbacks and promises will not have access to the context value. However, this works well with async/await functions. Only the async functions needs to be called using await so that it is in the same call stack as the function that is provided with the context value.

## License
MIT