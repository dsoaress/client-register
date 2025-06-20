import winston from 'winston'

export const loggerConfig = {
  transports: [new winston.transports.Console()],
  level: process.env.NODE_ENV === 'test' ? 'none' : 'info',
  format: winston.format.json(),
  meta: true
}

export const logger = winston.createLogger(loggerConfig)
