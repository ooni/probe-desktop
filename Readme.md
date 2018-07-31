# OONI Probe Desktop

**Attention** This is under heavy development and should only be run and used
by OONI developers. Use at your own risk and if you do use it, you may have to
do some cleanup when we release the first public release of OONI Probe.

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

We also assume you have the `gooni` source code checked out and working
compilers.

Then you can run:
```
yarn install
```

## Usage

To build and run a development mode electron instance run:
```
yarn run start
```

To create a standalone packaged app:

Be sure you have copied the binaries into the bin tree, by doing:

```
yarn run cp-bin
```

The above expects you to have in ../probe-cli a built version of all the
binaries you need.

Then run:

```
yarn run pack:mac
yarn run pack:win
```
