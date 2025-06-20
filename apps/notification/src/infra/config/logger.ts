import winston from 'winston'

export const loggerConfig = {
  transports: [new winston.transports.Console()],
  level: 'info',
  format: winston.format.prettyPrint({
    colorize: true,
    depth: 3
  }),
  meta: true
}

export const logger = winston.createLogger(loggerConfig)
