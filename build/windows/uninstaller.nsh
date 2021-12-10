!macro customInstall
  Var /GLOBAL resourceDir
  StrCpy $resourceDir '$INSTDIR\resources'

  ; Write ooniprobe-unattended.bat
  FileOpen $0 '$resourceDir\bin\ooniprobe-unattended.bat' w
  FileWrite $0 '@echo off'
  FileWrite $0 '$\r$\n'
  FileWrite $0 'set OONI_HOME=$APPDATA\OONI Probe\ooni_home_autorun'
  FileWrite $0 '$\r$\n'
  FileWrite $0 'set OONI_TOR_BINARY=$resourceDir\bin\tor.exe'
  FileWrite $0 '$\r$\n'
  FileWrite $0 '$resourceDir\bin\ooniprobe.exe --software-name=ooniprobe-desktop-unattended run unattended'
  FileWrite $0 '$\r$\n'
  FileClose $0

  ; Write hidecmd.vbs
  FileOpen $1 '$resourceDir\bin\hidecmd.vbs' w
  FileWrite $1 'Dim WinScriptHost'
  FileWrite $1 '$\r$\n'
  FileWrite $1 'Set WinScriptHost = CreateObject ("Wscript.Shell")'
  FileWrite $1 '$\r$\n'
  FileWrite $1 'WinScriptHost.Run Chr(34) & "$resourceDir\bin\ooniprobe-unattended.bat" & Chr(34), 0'
  FileWrite $1 '$\r$\n'
  FileWrite $1 'Set WinScriptHost = Nothing'
  FileWrite $1 '$\r$\n'
  FileClose $1

!macroend

!macro customUnInstall
  ${ifNot} ${isUpdated}
    ExpandEnvStrings $0 %COMSPEC%
    ExecWait '"$0" /c "SchTasks /Delete /TN org.ooni.probe-desktop /F'
  ${endIf}
!macroend
