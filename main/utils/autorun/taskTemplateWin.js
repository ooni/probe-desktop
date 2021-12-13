const { is } = require('electron-util')

const getStartBoundary = () => {
  const now = new Date()
  // In one minute
  now.setMinutes(now.getMinutes() + 1)

  // use Date.toISOString() and account for timezone offset
  // StartBoundary format - YYYY-MM-DDTHH:mm:ss
  // Date.toISOString()   - YYYY-MM-DDTHH:mm:ss.sssZ
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().split('.')[0]
}

// This file describes the properties of the background task that runs ooniprobe.exe
// Refer: https://docs.microsoft.com/en-us/windows/win32/taskschd/task-scheduler-schema
const taskXMLTemplate = ({ taskName, taskRun, cwd }) =>
// eslint-disable-next-line indent
`<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <URI>${taskName}</URI>
  </RegistrationInfo>
  <Triggers>
    <TimeTrigger>
      <Repetition>
        <Interval>PT1H</Interval>
        <StopAtDurationEnd>false</StopAtDurationEnd>
      </Repetition>
      <StartBoundary>${getStartBoundary()}</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
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
      <Command>${taskRun}</Command>
      <WorkingDirectory>${cwd}</WorkingDirectory>
  </Exec>
  </Actions>
</Task>
`

module.exports = {
  taskXMLTemplate
}
