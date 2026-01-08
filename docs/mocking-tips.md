# Mocking tips

## Using satisfies for mock objects

This removes all the capabilities of `vi.fn()` members:

```ts
const mock: SomeDependency = {
  sub: {
    method: vi.fn<SomeDependency["sub"]["method"]>(),
  },
};

// Overriding the return value does not work
mock.sub.method.mockReturnValue(); // Type error - mockReturnValue is missing
```

Using `satisfies` instead solves it, as it is no longer type narrowing the object:

```ts
const mock = {
  sub: {
    method: vi.fn<SomeDependency["sub"]["method"]>(),
  },
} satisfies SomeDependency;

// Works as expected
mock.sub.method.mockReturnValue();
```
