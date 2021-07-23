/*
MIT License

Copyright (c) 2017 Andrea Franchini

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Based on: https://github.com/AndreaFranchini/windows-scheduler/blob/master/task.js

const { execSync } = require('child_process')
const log = require('electron-log')
const { app } = require('electron')
const { join } = require('path')
const { getBinaryDirectory, getAutorunHomeDir, getBinaryPath } = require('../paths')
const { writeFile, unlink } = require('fs').promises
const { existsSync, writeFileSync } = require('fs-extra')
const { taskXMLTemplate, taskBatchTemplate, taskVBScriptTemplate } = require('./taskTemplateWin')

const taskBatchFileName = 'ooniprobe-unattended.bat'
const taskVBScriptFileName = 'hidecmd.vbs'
const taskXmlFileName = 'ooniprobe-autorun-task.xml'
const taskVBScriptFilePath = join(getBinaryDirectory(), taskVBScriptFileName)
const taskBatchFilePath = join(getBinaryDirectory(), taskBatchFileName)
const taskXmlFilePath = join(app.getPath('temp'), taskXmlFileName)

function exec(command) {
  return execSync(`cmd /C schtasks ${command}`)
}

module.exports = {
  init: function (/* taskId, opts */) {
    // Check if required files are on disk
    // (Re)generate files that are missing or removed by an update
    if (!existsSync(taskBatchFilePath)) {
      log.verbose(`Autorun task batch file missing at ${taskBatchFilePath}`)
      try {
        // Create batch file to run ooniprobe run unattended
        const batchFileStr = taskBatchTemplate({
          OONI_HOME_autorun: getAutorunHomeDir(),
          pathToBinary: getBinaryPath()
        })
        writeFileSync(taskBatchFilePath, batchFileStr)
        log.debug(`Autorun task batch file created: ${taskBatchFilePath}`)
      } catch (e) {
        log.error(`Failed to create autorun task batch file: ${taskBatchFilePath}: ${e.message}`)
      }
    }
    if (!existsSync(taskVBScriptFilePath)) {
      log.verbose(`Autorun task VBscript file missing at ${taskVBScriptFilePath}`)
      try {
        const VBSCriptStr = taskVBScriptTemplate({ taskBatchFileName })
        writeFileSync(taskVBScriptFilePath, VBSCriptStr)
        log.debug(`Autorun task VBscript file created: ${taskVBScriptFilePath}`)
      } catch (e) {
        log.error(`Failed to create autorun task VBscript file: ${taskVBScriptFilePath}: ${e.message}`)
      }
    }
    log.verbose('Initialized autorun.')
  },

  get: function (taskname, format, verbose) {

    return new Promise(function (resolve, reject) {

      try {
        validate.get_params(taskname, format, verbose)

      } catch (err) {
        return reject(err.message)
      }

      let command = ' /Query'

      if (taskname) command = command.concat(` /TN ${taskname}`)
      if (format) command = command.concat(` /FO ${format}`)
      if (verbose) command = command.concat(' /V')

      try {
        // pipe stderr to null to suppress unmanageable error message when not found
        const result = exec(command.concat(' 2> nul'))
        resolve(result.toString())

      } catch (err) {
        reject('Task: Get error')
      }
    })
  },

  createWithoutXML: function (taskname, taskrun, schedule) {

    return new Promise((resolve, reject) => {

      try {
        validate.create_params(taskname, taskrun, schedule)

      } catch (err) {
        return reject(err.message)
      }

      this.get(taskname)
        .then(() => {
          return reject('Task: Create error - Taskname already exists')
        })
        .catch(() => {
          let command = ` /Create /TN ${taskname} /TR ${taskrun}`

          if (schedule.frequency) command = command.concat(` /SC ${schedule.frequency}`)
          if (schedule.modifier) command = command.concat(` /MO ${schedule.modifier}`)
          if (schedule.day) command = command.concat(` /D  ${schedule.day}`)
          if (schedule.month) command = command.concat(` /M  ${schedule.month}`)
          if (schedule.starttime) command = command.concat(` /ST ${schedule.starttime}`)
          if (schedule.endtime) command = command.concat(` /ET ${schedule.endtime}`)
          if (schedule.every) command = command.concat(` /RI ${schedule.every}`)
          if (schedule.startdate) command = command.concat(` /SD ${schedule.startdate}`)
          if (schedule.enddate) command = command.concat(` /ED ${schedule.enddate}`)

          try {
            const result = exec(command)
            resolve(result.toString())

          } catch (err) {
            reject(`Task: Create error: ${err.message}`)
          }
        })
    })
  },

  create: function (taskname) {
    return new Promise((resolve, reject) => {
      try {
        validate.create_xml_params(taskname)
      } catch (err) {
        return reject(err.message)
      }

      this.get(taskname)
        .then(() => {
          return reject('Task: Create error - Taskname already exists')
        })
        .catch(async () => {

          try {
            // Create batch file to run ooniprobe run unattended
            const batchFileStr = taskBatchTemplate({
              OONI_HOME_autorun: getAutorunHomeDir(),
              pathToBinary: getBinaryPath()
            })
            await writeFile(taskBatchFilePath, batchFileStr)
            log.debug(`Autorun task batch file created: ${taskBatchFilePath}`)

            const VBSCriptStr = taskVBScriptTemplate({ taskBatchFileName })
            await writeFile(taskVBScriptFilePath, VBSCriptStr)
            log.debug(`Autorun task VBscript file created: ${taskVBScriptFilePath}`)

            // Generate xml file to schedule the task to run the batch file
            const taskXmlStr = taskXMLTemplate({
              taskName: taskname,
              taskRun: taskVBScriptFilePath,
              cwd: getBinaryDirectory()
            })

            await writeFile(taskXmlFilePath, taskXmlStr)
            log.debug(`Autorun task XML file created: ${taskXmlFilePath}`)

            let command = ` /Create /TN ${taskname} /XML ${taskXmlFilePath} /F`

            const result = exec(command)

            resolve(result.toString())

          } catch (err) {
            reject(`Task: Create error: ${err.message}`)
          } finally {
            unlink(taskXmlFilePath)
            log.debug('Autorun task XML file deleted')
          }
        })
    })
  },

  update: function (taskname, taskrun, schedule, enable) {

    return new Promise((resolve, reject) => {

      try {
        validate.update_params(taskname, taskrun, schedule, enable)

      } catch (err) {
        return reject(err.message)
      }

      this.get(taskname)
        .then(() => {

          let command = ` /Change /RU SYSTEM /TN ${taskname}`

          if (taskrun) command = command.concat(` /TR ${taskrun}`)
          if (schedule) {
            if (schedule.starttime) command = command.concat(` /ST ${schedule.starttime}`)
            if (schedule.endtime) command = command.concat(` /ET ${schedule.endtime}`)
            if (schedule.every) command = command.concat(` /RI ${schedule.every}`)
            if (schedule.startdate) command = command.concat(` /SD ${schedule.startdate}`)
            if (schedule.enddate) command = command.concat(` /ED ${schedule.enddate}`)
          }
          if (enable && enable == true) command = command.concat(' /ENABLE')
          if (enable && enable == false) command = command.concat(' /DISABLE')

          try {
            const result = exec(command)
            return resolve(result.toString())

          } catch (err) {
            return reject(`Task: Update error: ${err.message}`)
          }
        })
        .catch((err) => {
          return reject(`Task: Update error - Taskname not found: ${err.message}`)
        })
    })
  },

  delete: function (taskname) {

    return new Promise((resolve, reject) => {
      try {
        validate.taskname(taskname)

      } catch (err) {
        return reject(err.message)
      }

      this.get(taskname)
        .then(() => {

          try {
            const result = exec(` /Delete /TN ${taskname} /F`)
            resolve(result.toString())

          } catch (err) {
            reject('Task: Delete error')
          }
        })
        .catch(() => {
          return reject('Task: Delete error - Taskname not found')
        })
    })
  },

  run: function (taskname) {

    return new Promise((resolve, reject) => {
      try {
        validate.taskname(taskname)

      } catch (err) {
        return reject(err.message)
      }

      this.get(taskname)
        .then(() => {

          try {
            const result = exec(` /Run /TN ${taskname}`)
            resolve(result.toString())

          } catch (err) {
            resolve('Task: Run error')
          }
        })
        .catch((err) => {
          return reject(`Task: Run error - Taskname not found: ${err.message}`)
        })
    })
  },

  end: function (taskname) {

    return new Promise((resolve, reject) => {
      try {
        validate.taskname(taskname)
      } catch (err) {
        return reject(err.message)
      }

      this.get(taskname)
        .then(() => {

          try {
            const result = exec(` /End /TN ${taskname}`)
            resolve(result.toString())

          } catch (err) {
            resolve('Task: End error')
          }
        })
        .catch(() => {
          return reject('Task: End error - Taskname not found')
        })
    })
  },
}

// From: https://github.com/AndreaFranchini/windows-scheduler/blob/master/lib/validate.js

const moment = require('moment')

const validate = {

  get_params: function (taskname, format, verbose) {

    // Optional
    if (taskname && !is_valid_taskname(taskname)) error('Invalid taskname')
    if (format && !is_valid_format(format)) error('Invalid format')
    if (verbose && !is_valid_boolean(verbose)) error('Invalid verbose')

    return true
  },

  create_params: function (taskname, taskrun, schedule) {

    // Mandatory
    if (!taskname) error('Taskname is required')
    if (!taskrun) error('Taskrun is required')
    if (!schedule) error('Schedule is required')
    if (!schedule.frequency) error('Frequency schedule option is required')

    if (!is_valid_taskname(taskname)) error('Invalid taskname')
    if (!is_valid_taskrun(taskrun)) error('Invalid taskrun')
    if (!is_valid_frequency(schedule.frequency, schedule.modifier)) error('Invalid frequency or modifier')

    const frequency = schedule.frequency
    // const modifier = schedule.modifier
    const day = schedule.day
    const month = schedule.month
    const starttime = schedule.starttime
    const endtime = schedule.endtime
    const every = schedule.every
    const startdate = schedule.startdate
    const enddate = schedule.enddate

    // Optional
    if (day && !is_valid_day(day, frequency)) error('Invalid day')
    if (month && !is_valid_month(month)) error('Invalid month')
    if (every && !is_valid_every(every)) error('Invalid every')
    if (starttime && !is_valid_hour(starttime)) error('Invalid starttime')
    if (endtime && !is_valid_hour(endtime)) error('Invalid endtime')
    if (startdate && !is_valid_date(startdate)) error('Invalid startdate')
    if (enddate && !is_valid_date(enddate)) error('Invalid enddate')

    // Invalid combinations
    if (every && (frequency == 'MINUTE' || frequency == 'HOURLY'))
      error('Invalid combination: if there is starttime or every options, frequency cannot be set to minute or hourly')
    if (endtime && !starttime)
      error('Invalid combination: endtime require starttime')
    if (parseInt(endtime) < parseInt(starttime))
      error('Invalid combination: endtime before starttime')

    return true
  },

  create_xml_params: function (taskname) {

    // Mandatory
    if (!taskname) error('Taskname is required')

    if (!is_valid_taskname(taskname)) error('Invalid taskname')

    return true
  },

  update_params: function (taskname, taskrun, schedule, enable) {

    // Mandatory
    if (!taskname) error('Taskname is required')
    if (!is_valid_taskname(taskname)) error('Invalid taskname')

    // At least one of
    if (!taskrun && !schedule && !enable) error('At least one of taskrun, schedule or enable is required')

    // Optional
    if (taskrun && !is_valid_taskrun(taskrun)) error('Invalid taskrun')
    if (enable && !is_valid_boolean(enable)) error('Invalid enable')
    if (schedule) {
      if (schedule.every && !is_valid_every(schedule.every)) error('Invalid every')
      if (schedule.starttime && !is_valid_hour(schedule.starttime)) error('Invalid starttime')
      if (schedule.endtime && !is_valid_hour(schedule.endtime)) error('Invalid endtime')
      if (schedule.startdate && !is_valid_date(schedule.startdate)) error('Invalid startdate')
      if (schedule.enddate && !is_valid_date(schedule.enddate)) error('Invalid enddate')
    }

    return true
  },

  taskname: function (taskname) {

    if (!taskname || !is_valid_taskname(taskname)) error('Invalid taskname')

    return true
  }
}

function error(msg) {
  throw new TypeError(`Task: ${msg}\n`)
}

function is_valid_taskname(taskname) {
  return (typeof taskname == 'string') && (taskname.length >= 3)
}

function is_valid_taskrun(taskrun) {
  return typeof taskrun == 'string'
}

function is_valid_frequency(frequency, modifier) {
  if (!['MINUTE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'ONLOGON', 'ONCE'].includes(frequency))
    return false

  if (modifier) {
    if (frequency == 'ONCE' && (modifier)) return false
    if (frequency == 'ONLOGON' && (modifier)) return false
    if (frequency == 'MINUTE' && (modifier < 1 || modifier > 1439)) return false
    if (frequency == 'HOURLY' && (modifier < 1 || modifier > 23)) return false
    if (frequency == 'DAILY' && (modifier < 1 || modifier > 365)) return false
    if (frequency == 'WEEKLY' && (modifier < 1 || modifier > 52)) return false
    if (frequency == 'MONTHLY' && (modifier < 1 || modifier > 12)) return false
  }
  return true
}

function is_valid_day(day, frequency) {
  if (frequency == 'MONTHLY') {
    return day > 0 && day < 32
  }
  else {
    return ['*', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].includes(day)
  }
}

function is_valid_month(month) {
  return ['*', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].includes(month)
}

function is_valid_hour(hour) {
  if (typeof hour != 'string') return false
  return moment(hour, 'HH:mm').isValid()
}

function is_valid_every(every) {
  if (typeof every != 'number') return false
  return every >= 1 && every <= 599940
}

function is_valid_date(date) {
  if (typeof date != 'string') return false
  return moment(date, 'DD/MM/YYYY').isValid()
}

function is_valid_format(format) {
  return ['TABLE', 'LIST', 'CSV'].includes(format)
}

function is_valid_boolean(boolean) {
  return typeof boolean == 'boolean'
}
