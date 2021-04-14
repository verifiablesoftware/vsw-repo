const winston = require('winston')
const {format} = require('winston');

const options = {
    file: {
        level: 'info',
        filename: './logs/app.logs',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    levels: winston.config.npm.levels,
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})

module.exports = logger