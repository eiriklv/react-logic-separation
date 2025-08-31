# Integration Testing

TODO: How to do integration testing when using DI

Full depth vs. partial (spectrum)

Approaches:

- Full depth (command layer - only possible if you terminate with a command layer and never expose what is below)
- Full depth (service/sdk layer - only possible if bottom layer is all service/sdk)
- Full depth (network layer / msw - only possible when you own the network calls)
- Full depth (dependency injection - using explicit dependencies all the way down the tree from the root unit under test)
- Partial depth (dependency injection - using explicit dependencies from the root and only drawing the boundary need for the test to work)
