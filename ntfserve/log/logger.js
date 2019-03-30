const winston = require("winston");
require('winston-daily-rotate-file');
const moment = require('moment');
const util = require('util');
const MESSAGE = Symbol.for('message');
const SPLAT = Symbol.for('splat');
require('winston-syslog').Syslog;

class Logger {
	constructor(Module, file, level = 'info'){
		this.options = {
			host: "127.0.0.1",
			port: "514",
		};
		this.logger = winston.createLogger({
			levels: winston.config.syslog.levels,
			level: level,
			format: winston.format(function(info, opts){
				let prefix = util.format('%s [%s] [%s]',moment().format('YYYY-MM-DD HH:mm:ss,SSS').trim(), Module, info.level.toUpperCase());
				if(info[SPLAT]){
					info[MESSAGE] = util.format('%s %s',prefix,util.format(info.message, ...info[SPLAT]));
				}else{
					info[MESSAGE] = util.format('%s %s',prefix, util.format(info.message));
				}
				return info;
			})(),
			transports: [
				//new winston.transports.Syslog(this.options),
				new winston.transports.Console(),
				new(winston.transports.DailyRotateFile)({
					filename: file,
					level: level,
					datePattern: 'YYYY-MM-DD',
					zippedArchive: false,
					maxSize: '50m',
					maxFiles: '30d'
				})
			]
		});
	
	}
	debug(...params){
		this.logger.debug(...params);
	}
	info(...params){
		this.logger.info(...params);
	}
	warn(...params){
		this.logger.warning(...params);
	}
	error(...params){
		this.logger.error(...params);
	}
}
module.exports = Logger;
