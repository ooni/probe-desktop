import * as Sentry from '@sentry/electron/renderer'
import { RewriteFrames } from '@sentry/integrations'
import log from 'electron-log/renderer'

export const init = async () => {
  try {
    const sendCrashReports = await window.electron.config.get('advanced.send_crash_reports')
    if (sendCrashReports) {
      log.debug('Initializing Sentry in renderer...')
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        const integrations = []
        if (process.env.NEXT_IS_SERVER === 'true') {
          // For Node.js, rewrite Error.stack to use relative paths, so that source
          // maps starting with ~/_next map to files in Error.stack with path
          // app:///_next
          integrations.push(
            new RewriteFrames({
              iteratee: (frame) => {
                frame.filename = frame.filename.replace(
                  __dirname,
                  'app:///'
                )
                frame.filename = frame.filename.replace('.next', '_next')
                return frame
              },
            })
          )
        }

        Sentry.init({
          enabled: process.env.NODE_ENV === 'production',
          integrations,
          dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
          release: process.env.NEXT_PUBLIC_COMMIT_SHA,
        })
        log.info('Sentry initialized in renderer.')
      }
    } else {
      log.debug('Crash reporting not enabled in config. Sentry not initialized in renderer.')
    }
  } catch (e) {
    log.error('Initializing Sentry failed: ', e)
  }
}
