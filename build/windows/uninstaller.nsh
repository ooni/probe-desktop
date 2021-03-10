!macro customUnInstall
  ${ifNot} ${isUpdated}
    ExpandEnvStrings $0 %COMSPEC%
    ExecWait `"$0" /c "SchTasks /Delete /TN org.ooni.probe-desktop /F`
  ${endIf}
!macroend
