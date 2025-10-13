# Mocking the network

TODO

- Fetch / Axios
- SDK with get/post
- Other protocols

Topics

- Abstracting on top of get/post (never using them directly)
- Using nock/msw for the network facing units
- Related to mocking generic functions (that cannot be made typesafe in a test setting because of being generic and typed/inferred from the call-site)
