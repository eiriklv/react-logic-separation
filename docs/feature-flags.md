# Feature Flags

TODO

Alternatives:

(Choose whether to treat it as an external dependency, or as a first class transitive primitive)

- Using a common library/helper for accessing flags + always wrapping a provider around the app or units under test
- Factoring out custom hook or function for each flag and injecting them through unit DI + using a provider around the app

Cases:

- How to inject conditional services based on flags
- How to inject conditional components based on flags
- How to inject conditional features based on flags
- How to inject conditional hooks based on flags (should you do this?)
