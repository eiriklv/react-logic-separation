# MVVM (Model-View-ViewModel) Pattern in React

- [What](#what)
  - [MVVM Architectural Pattern](#enterprise-architecture-pattern)
  - [MVVM vs. MVC](#mvvm-vs-mvc)
  - [References](#references)
- [Why](#why)
  - [Testability](#testability)
  - [Maintainability](#maintainability)
  - [Scalability](#scalability)
- [How](#how)
  - [Pattern](#pattern)
    - [Separating business logic from the view](#separating-business-logic-from-the-view)
    - [ViewController vs. ViewModel](#viewcontroller-vs-viewmodel)
  - [Incremental Adoption](#incremental-adoption)
    - [Factor out to ViewModel](#factor-out-to-viewmodel)
    - [Factor out to Models](#factor-out-to-models)
    - [Factor out to plain JS classes](#factor-out-to-plain-js-classes)
  - [Other Considerations](#other-considerations)
    - [Sharing ViewModels](#sharing-viewmodels)
- [Tradeoffs](#tradeoffs)

# What

What is MVVM?

## MVVM Architectural Pattern

Model–view–viewmodel (MVVM) is an architectural pattern that facilitates the separation of the development of a user interface (the view) from the development of the business logic (the model) such that the view is not dependent upon any specific model platform.

### Components of MVVM

**Model:**

Refers to the domain model and represents the business domain being modeled, containing things like business logic, rules, repositories, services, etc. Same as the "Model" in "Model-View-Controller".

**View:**

Represents the structure, layout, and appearance of what a user sees on the screen. Displays a representation of the domain model and receives the user's interaction with the view, which is forwarded to the domain model through the view controller. Same as the "View" in "Model-View-Controller".

**View model:**

The view model is an abstraction of the view exposing public properties and commands. This view model is consumed by the view, where it can display the properties and call the commands. The view model has no reference to the view, but the view model is owned by and referenced by the view.

## MVVM vs. MVC

The biggest difference between MVVM and MVC is that MVVM introduces a layer between the view controller (or view) and the model. This enables you to further decouple the development of the business logic and the user interface.

The same feature in both an MVC and an MVVM application could be structured in the following way:

### MVC

![MVC](../assets/mvc.png)

View:

- Displays properties passed to it
- Triggers commands passed to it on user interaction

Controller:

- Has a reference to the view
- Is responsible for rendering the view
- Has a reference to the model
- Is responsible for preparing (mapped) properties and commands from the model into something that can be passed to and consumed by the view

Model:

- Contains the domain/business logic
- Exposes properties and commands that can be consumed

Code Example:

```ts
// TODO
```

### MVVM

![MVVM](../assets/mvvm.png)

View:

- Displays properties passed to it
- Triggers commands passed to it on user interaction

Controller:

- Has a reference to the view
- Is responsible for rendering the view
- _\*Has a reference to the view model_
- _\*Is responsible for forwarding the view model properties and commands into the view_

View model:

- Has a reference to the model
- Is responsible for preparing (mapped) properties and commands from the model into something consumed by the view controller

Model:

- Contains the domain/business logic
- Exposes properties and commands that can be consumed

Code Example:

```ts
// TODO
```

## References

- https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel
- https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm
- https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/patterns-wpf-apps-with-the-model-view-viewmodel-design-pattern
- https://learn.microsoft.com/en-us/previous-versions/xamarin/xamarin-forms/enterprise-application-patterns/mvvm

# Why

TODO

## Testability

TODO

## Maintainability

TODO

## Scalability

TODO

# How

TODO

## Pattern

TODO

## Incremental Adoption

TODO

# Tradeoffs

TODO
