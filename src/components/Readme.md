# Component Methods

Stores multiple groups of methods that are designed to work together in the same system to deliver functionality. Each component focuses on a single function or category of functions. Each component can be reusable, like a service, but generally are designed for the current system. For example a user component can be created to provide an API to create and manage users.

Components that provide API's should follow the [Model-View-Controller pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). For this express applications, these are split into Model, Router, and Middleware.

## Router

Router's specify the API routes that are available for the component. They also define which middleware should be associated with each route and in what order. Each route should follow [REST principles](https://restfulapi.net/) and should be optimized for readability. Developers should be able to read the router file and understand the routes available.

## Middleware

[Express middleware](https://expressjs.com/en/guide/using-middleware.html) are the controller part of the model-view-controller pattern. They handle, transform, and validate user input and coordinate the desired operations. Middleware should be single purpose and operate in a chain-line manner, passing the results of their operation to the next middleware for processing. As a gut check if you find middleware difficult to test or you have to scroll through the method, it's time to break it up into multiple methods.

## Model

Models perform queries on the database. Their job is to wrap the complexities of querying the data into easy to use methods. With this decoupling, as the application grows it will be much easier to optimize the more heavily used queries to gain significant performance.


