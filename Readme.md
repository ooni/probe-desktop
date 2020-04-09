# OONI Probe Desktop

This is the desktop implementation of OONI Probe.

Our two primary target platforms are:

- macOS
- Windows > 7 (we may also support older versions, but not as primary tagets)

Moreover, since it's written in electron, we plan on also supporting Linux desktop users.

For some background on the decision to use electron and the libraries we chose
to use, see: [Writing a modern cross-platform desktop
app](https://ooni.torproject.org/post/writing-a-modern-cross-platform-desktop-app/).

## Setup

In order to start hacking on this, we assume you have `node` and `yarn`
installed.

Then you can run:
```
yarn install
```

You will also need to have copied a compiled binary of `probe-cli` into the
directory for the platform you plan to do development on.

You can download them by running:
```
yarn run probe-cli
```

## Usage

To build and run a development mode electron instance run:
```
yarn run start
```

To update the translations:
* Save the strings from the canonical spreadsheet into `data/lang-en.csv`
* Run `$ node scripts/update-translations.js`
* Commit `data/lang-en.csv`, `lang/en.json` and `renderer/static/translations.js`
into git

To create a signed packaged app you will need to have configured the following
environment variables:

```
CSC_NAME=Hermes OONI Dev Key
APPLEIDPASS=XXXX
APPLEID=xxx@yyy.com

CSC_LINK=/path/to/secrets/file.p12
CSC_KEY_PASSWORD=XXXX
```

You can place them inside of `.env` file and they will be picked up by the
following build commands.

To publish a release you should run:
```
yarn run publish
```

**Important caveat** be sure to not push the tag for the upcoming release until
after the `yarn run publish` command has run successfully. If you do so users
of the OONI Probe Desktop app will get an error when they start the app because
the auto-update system will try to fetch the metadata associated with that tag.

You can also make a build, but not publish it by running the following commands:
```
yarn run pack:mac
yarn run pack:win
yarn run pack:linux
```
