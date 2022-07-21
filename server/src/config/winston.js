const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize } = winston.format;

// 로그 저장 경로
const logDir = 'logs';

const logFormat = {
  file: printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  console: printf(info => `${info.level}: ${info.message}`),
};

// log level
// error : 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6

const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat.file
  ),
  transports: [
    // info level log save file options
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.log', // 날짜로 파일 이름 저장
      maxFiles: 30, // 30일
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'warn',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/warn',
      filename: '%DATE%.warn.log',
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

logger.stream = {
  write: message => {
    logger.info(message);
  },
};

if (process.env.NODE_ENV !== 'production') {
  logger.clear(); // dev 모드일시 파일저장 x
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // console 에 출력할 로그 컬러 설정 적용함
        logFormat.console // log format 적용
      ),
    })
  );
}

module.exports = logger;
