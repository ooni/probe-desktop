# Changelog
## OONI Probe Desktop 3.1.0 [2020-11-19]

probe-cli: 3.0.11

### Added

* Language selector to set the app's locale
* Category code selector to enable/disable website categories to use in Web Connectivity tests

### Changed

* New settings screen layout


## OONI Probe Desktop 3.0.4 [2020-10-14]

probe-cli: 3.0.8

### Fixes
* Flickering when running a test (ooni/probe#1189)
* Fix crash when viewing results of stopped tests (ooni/probe#1245)
* Fix alignment of buttons in onboarding screens (ooni/probe#1138)
* Fix spacing and alignment of result overview section (ooni/probe#1043)

### Changes
* Skip downloading `zip` archive of probe-cli in the download script (#176)

### Security
* Dependabot version bumps for `electron`, `elliptic`, `lodash`, `markdown-to-jsx`

### Dependencies
* Replace `react-lottie` with `react-lottie-player`

## OONI Probe Desktop 3.0.3 [2020-06-29]

probe-cli: 3.0.3

### Fixes
* Fix missing auto update notice in about window (ooni/probe#1184)
* Fix logic in looking for informed consent in config file (ooni/probe#1188)
* Fix long paths in about window debug section (ooni/probe#1116)
* Fix missing translation string in when stopping a test (ooni/probe#1204)
* Disable pausing of animation during onboarding quiz (ooni/probe#1196)

### Changes
* Removed styling of bootstrap time unit in Psiphon measurement details

### Security
* Bump websocket-extensions from 0.1.3 to 0.1.4 [dependabot]

### Dependencies
* Bumped `electron-builder` to `22.7.0`
* Bumped `electron-updater` to `4.3.1`

## OONI Probe Desktop 3.0.2 [2020-06-03]

probe-cli: 3.0.1

### Fixed

* Critical bug in probe-cli that lead to `probe_cc` being always set to ZZ

### Changed

* Show measurements in local system timezone

### Removed

* Dropped macos from e2e testing matrix because it times out too often

## OONI Probe Desktop 3.0.1 [2020-05-05]

probe-cli: 3.0.0

### Added
* Config file migration tool

### Removed
* Settings entry for including country code
* Analytics on onboarding screen

### Fixed
* Show NDT server name correctly
* Multiple about windows opening on startup

### Changed
* Usage statistics collection is now on by default
* Uses [probe-cli@3.0.0](https://github.com/ooni/probe-cli/releases/tag/v3.0.0)

## OONI Probe Desktop 3.0.0 [2020-04-21]

probe-cli: 3.0.0-rc.14

First public stable release of OONI Probe Desktop

Support running the following test groups:
* Websites
* Instant Messagging
* Circumvention
* Middleboxes
