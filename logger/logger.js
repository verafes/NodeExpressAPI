class Log {
    info = text => {
        console.info(`[getDate()]`, "[INFO]", text);
    }
    warning = text => {
        console.info(`[getDate()]`, "[INFO]", text);
    }
    error = text => {
        console.info(`[getDate()]`, "[INFO]", text);
    }
    //fatal
    server = text => {
        console.info(`[getDate()]`, "[SEVR]", text);
    }
    //runner
    //test
}

function getDate() {
    const date = new Date()
    return date.toLocaleDateString('en-US', {timeZoneName: 'short'});
}

const log = new Log();

export default log;