class Log {
    static info = text => {
        console.info(`[getDate()]`, "[INFO]", text);
    }
    static warning = text => {
        console.info(`[getDate()]`, "[INFO]", text);
    }
    static error = text => {
        console.info(`[getDate()]`, "[INFO]", text);
    }
    static fatal= text => {
        console.info(getData(), "[FATAL]", text)
    }
    static server = text => {
        console.info(`[getDate()]`, "[SEVR]", text);
    }
    //runner
    //test
}

function getDate() {
    const date = new Date()
    return date.toLocaleDateString('en-US', {timeZoneName: 'short'});
}

// const log = new Log();

export default Log;