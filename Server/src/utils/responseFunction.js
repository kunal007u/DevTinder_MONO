const errorResponseFunc = (message, error = null, code, type) => {
    const finalResponse = {
        status: {
            message: message,
            error: error,
            code: code,
            type: type,
        },
    };

    return finalResponse;
};


const successResponseFunc = (message, code, type, data, name) => {
    const finalResponse = {
        status: {
            message: message,
            code: code,
            type: type,
        },
        data,
        name,
    };

    return finalResponse;
};

export { errorResponseFunc, successResponseFunc };
