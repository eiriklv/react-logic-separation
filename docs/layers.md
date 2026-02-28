### Layers

Services

- sdks

(Service) Commands (represent a domain use case)

- might consume and use multiple services
- plain functions/classes
- no signals here

Business / Domain logic layer (repositories/models/etc)

- might consume multiple commands
- not tied to any view
- business logic
- exposes signals

(Domain) Commands

- would have signals

View models

- consumes one or more domain/business layer models/repositories/etc
- owned by a single view (1:1 between view and view model)
- might have their own signals (local)

Views

- consumer a single view model
