exports.requireLogin = (req, res, next) => {
    // Exclude /login from redirection
    if (req.session && req.session.user || req.url === '/login' || req.url === '/register') {
        return next();
    } else {
        return res.redirect('/login');
    }
};


/*
Certainly! Let's break down each line of the modified `requireLogin` middleware:

```javascript
exports.requireLogin = (req, res, next) => {
```

1. `exports.requireLogin`: This line exports the middleware function as `requireLogin`. It allows other parts of your code to use this middleware by importing it with `require('./path/to/middleware').requireLogin`.

2. `(req, res, next) => {`: This part declares an arrow function, which is the actual middleware function. The function takes three parameters:

   - `req`: The request object represents the HTTP request and contains information about the request, such as headers, parameters, and the request body.
   - `res`: The response object represents the HTTP response that the middleware can modify before sending it back to the client.
   - `next`: A callback function that, when called, passes control to the next middleware in the stack. If `next` is not called, the request remains within the current middleware.

```javascript
    // Exclude /login from redirection
    if (req.session && req.session.user || req.url === '/login') {
```

3. `if (req.session && req.session.user || req.url === '/login')`: This line checks if either of the following conditions is true:

   - `req.session && req.session.user`: Checks if there is a `session` object in the request and if that session object has a `user` property. It assumes that user information is stored in the session.
   - `req.url === '/login'`: Checks if the requested URL is `/login`.

   If either condition is true, it means the user is either logged in or attempting to access the login page, so the middleware allows the request to proceed to the next middleware or route.

```javascript
        return next();
    } else {
```

4. `return next();`: If the conditions in the `if` statement are true (meaning there is a valid user session or the URL is `/login`), this line calls the `next` function, allowing the request to proceed to the next middleware or route in the stack.

```javascript
        return res.redirect('/login');
    }
```

5. `return res.redirect('/login');`: If the conditions in the `if` statement are false (meaning there is no valid user session, and the URL is not `/login`), this line sends a redirect response to the client, instructing the browser to navigate to the `/login` URL.

In summary, this modified middleware checks whether the user is logged in or trying to access the login page. If either condition is met, it allows the request to proceed; otherwise, it redirects the user to the login page.
*/