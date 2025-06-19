import expressWinston from 'express-winston'

import { loggerConfig } from '../../../../config/logger'

export const loggerHandler = expressWinston.logger({
  ...loggerConfig,
  statusLevels: false,
  level: (_req, res) => {
    let level = ''
    if (res.statusCode >= 100) level = 'info'
    if (res.statusCode >= 400) level = 'warn'
    if (res.statusCode >= 500) level = 'error'
    return level
  },
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true
})
