# Translations

TODO

Alternatives:

(Choose whether to treat it as an external dependency, or as a first class transitive primitive)

- Either buy in to some default approach, where none of it is mocked, but rather use providers during testing
  - Using a common library/helper for accessing translations (singleton) + always wrapping a provider around the app or units under test
- Injecting it through unit DI + using a provider around the app
