const { is } = require('electron-util')

const getRandomStartBoundary = () => {
  const now = new Date()
  if (is.development) {
    // In one minute
    now.setMinutes(now.getMinutes() + 1)
  } else {
    // Choose a random hour between 9:00 and 18:00 on the next date
    now.setDate(now.getDate() + 1)
    now.setHours(Math.ceil(Math.random() * 9) + 9, 0, 0)
  }
  // use Date.toISOString() and account for timezone offset
  // StartBoundary format - YYYY-MM-DDTHH:mm:ss
  // Date.toISOString()   - YYYY-MM-DDTHH:mm:ss.sssZ
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().split('.')[0]
}

const taskXMLTemplate = ({ taskName, taskBatchFile }) =>
// eslint-disable-next-line indent
`<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <URI>${taskName}</URI>
  </RegistrationInfo>
  <Triggers>
    <CalendarTrigger>
      <StartBoundary>${getRandomStartBoundary()}</StartBoundary>
      <Enabled>true</Enabled>
      <ScheduleByDay>
        <DaysInterval>1</DaysInterval>
      </ScheduleByDay>
    </CalendarTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author">
      <LogonType>InteractiveToken</LogonType>
      <RunLevel>LeastPrivilege</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
    <IdleSettings>
      <StopOnIdleEnd>false</StopOnIdleEnd>
      <RestartOnIdle>false</RestartOnIdle>
    </IdleSettings>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <RunOnlyIfIdle>false</RunOnlyIfIdle>
    <WakeToRun>false</WakeToRun>
    <ExecutionTimeLimit>PT72H</ExecutionTimeLimit>
    <Priority>7</Priority>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>${taskBatchFile}</Command>
    </Exec>
  </Actions>
</Task>
`

const taskBatchTemplate = ({ taskCmd, OONI_HOME_autorun }) => `
@echo off
set OONI_HOME=${OONI_HOME_autorun}
${taskCmd}
`

module.exports = {
  taskXMLTemplate,
  taskBatchTemplate
}