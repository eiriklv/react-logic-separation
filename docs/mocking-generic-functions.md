# TODO

How to deal with functions where the output is defined by a type argument,
but it's not actually related to any of the input arguments.

```ts
function post<T>(path: string): T {
  //...
}
```
