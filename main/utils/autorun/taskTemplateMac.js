module.exports = ({ taskName, taskCmdArgs, OONI_HOME_autorun }) =>
`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${taskName}</string>
    <key>KeepAlive</key>
    <false/>
    <key>RunAtLoad</key>
    <true/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OONI_HOME</key>
        <string>${OONI_HOME_autorun}</string>
    </dict>
    <key>ProgramArguments</key>
    <array>
    ${taskCmdArgs.map(arg => `
        <string>${arg}</string>`).join('')}
        <string>--log-handler=syslog</string>
    </array>
    <key>StartInterval</key>
    <integer>3600</integer>
</dict>
</plist>
`
