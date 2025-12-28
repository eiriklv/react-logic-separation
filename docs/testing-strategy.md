# Testing Strategy

TODO: Testing stategy and hierarchy

- Unit tests for unit/module
- Integration tests for every application feature
- E2E tests for every user flow

Contrast this with the google test strategy

- Small test
- Medium test
- Large test

Testing hierarchy

- Unit tests for every unit
  - All non-embedded dependencies must be mocked
  - Ensures that every unit in isolation works as expected
  - Helps track down unit level issues
- Single depth integration tests for every unit
  - All direct non-embedded dependencies must be real, but all transitive dependencies must be mocked
  - Ensures that every direct integration works as expected
  - Helps track down integration level issues
- Functional tests for every feature or function (user story)
  - All dependencies must be real all the way down to the service layer, which must be mocked
  - Ensures that every feature and flow works as expected
  - Helps track down feature level issues
- E2E tests for whatever remains (critical flows / smoke tests)
  - Shallow => Real application, fake io
    - Ensures frontend application works as expected
  - Mid => Real application, real io, but external services are mocked
    - Ensures that frontend application is configured correctly against external services
  - Deep => Real dependencies, real io, real external services
    - Ensures that frontend and all services are configured correctly
