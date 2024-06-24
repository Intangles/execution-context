const StackTrace = require("stacktrace-js");
const crypto = require("crypto");
const globalExecutionContext = {};
const KEY_PREFIX = "$$exec_context$$";

/**
 * Destroy the execution context
 *
 * @param {string} executionId
 */
function destroyExecutionContext(executionId) {
    delete globalExecutionContext[executionId];
}

/**
 * Get the execution UUID from the function name
 * 
 * @param {string} functionName
 * @returns {string} execution UUID
 * */
function getExecutionUUID(functionName = "") {
    return functionName
        .replace("Object.", "")
        .replace(KEY_PREFIX, "")
        .replace("async ", "");
}

/**
 * Find the context frame from the callstack
 **/
const findContextFrame = () => {
    const stack = StackTrace.getSync();
    if (!stack || !stack.length) {
        return null;
    }

    return stack.find(function findFrame(frame) {
        if (frame && frame.functionName) {
            return frame.functionName.includes(KEY_PREFIX);
        }
    });
};
/**
 * Get the execution context from callstack
 *
 * @returns {any} execution context
 */
exports.getExecutionContext = function getExecutionContext() {
    const stackFrame = findContextFrame();
    if (!stackFrame) {
        return null;
    }
    const uuid = getExecutionUUID(stackFrame.functionName);
    return globalExecutionContext[uuid];
};

/**
 * Set execution context
 *
 * @param {any} contextValue - context value
 */
exports.setExecutionContext = function setExecutionContext(contextValue) {
    const stackFrame = findContextFrame();
    if (!stackFrame) {
        return;
    }
    const uuid = getExecutionUUID(stackFrame.functionName);
    globalExecutionContext[uuid] = contextValue;
};

/**
 * Initialize execution context
 *
 * @param {Function} handler - actual handler function
 */
exports.provideExecutionContext = function provideExecutionContext(
    handler,
    contextValue
) {
    const uniqueId = "f-" + crypto.randomBytes(16).toString("hex") + "-" + Date.now();
    const that = this;
    const functionName = `Object.${KEY_PREFIX}${uniqueId}`;
    const contextProvider = {
        [functionName]: async function () {
            try {
                const returnValue = await handler.apply(that, arguments);
                // destroy the execution context after the execution is completed
                destroyExecutionContext(uniqueId);
                return returnValue;
            } catch (err) {
                destroyExecutionContext(uniqueId);
                throw err;
            }
        },
    };
    globalExecutionContext[uniqueId] = contextValue;
    contextProvider[functionName].name = functionName;
    return contextProvider[functionName];
};
