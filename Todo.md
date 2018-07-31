# TODO

This is a partial list of what needs to still be done on the OONI Probe Desktop
app.

* Implement the missing views for `components/results/TestResultsDetails` views.

To do this you should follow the pattern outlined for `components/nettests/im/facebook-messenger.js`

* Implement all the settings related views (Configure and global settings)

* Migrate the components inside of `components/to-migrate` into `ooni/design-system`

* Decorate with `FormattedMessage` all the strings that are to be translated

* Add support for showing animation transitions using lottie (see: `ooni/design-system/components/animations`)

* Style the onboarding view based on the mockups

* Style the Running test view based on the mockups

* Go through the icons and ensure we are using the latest ones

* Store and show the category code (with the relevant icon) for each tested website

* Add support for re-uploading not uploaded tests

* Add support for re-running failed tests
