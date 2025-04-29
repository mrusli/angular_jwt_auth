# AngularJwtAuth

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.10.  AngularJwtAuth is an experimental authorization using Jwt access token and refresh token.  This application works with spring boot jwt-authentication (https://github.com/mrusli/jwt-authentication), acting as the back-end to interact with database.  The jwt-authentication app must be operational before this angular project is functional.

1. Access the login page: http://localhost:4200/login.

2. Inspect the network traffic by using the 'inspect' feature of the browser (assuming it's Chrome).

3. When login is successful, the console shouldn't show any errors.

4. Try calling the API: http://localhost:4200/testAPI

5. Watch the network when the API is called.

6. The following rules apply for the API call:

- The access token is valid for only 30 seconds.  When the access token expires, it will automatically renew using the refresh token.
- The refresh token also has an expiry time.  It's currently set at 4 minutes.  When the refresh token expired (after 4 minutes), user must login again to obtain a new refresh token.

## How the code works

The login component simply allows user to login and obtain the token (access and refresh).  The tokens are then saved into the 'localStorage' of the browser.  When the API is called, the access token is then appended on the header (as BearerToken).  Note that ONLY 'User' and 'Moderator' needs to use access token.  Login and RefreshToken API skips the process.

## Using Interceptor

There's an interceptor that intercept the network traffic from the app to the back-end by observing the HttpRequest and HttpRespond.  This interceptor must be included in the app.config.ts:
    provideHttpClient(withInterceptorsFromDi()),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true,
    }

The interceptor performs 2 main functions:
1. 'Clone' the request to add authorization information (access token):

    const cloned = req.clone({
        headers: req.headers.set('Authorization', token)
    });

2. Handle the 401 error in which, most likely requires token refresh to obtain new access token:
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        ...
        const refToken = localStorage.getItem('refreshToken'); // Assuming you have a refresh token stored
        console.log("TokenInterceptor: Refreshing token using refresh token", refToken);
      
        if (refToken) {
          return this.http.post('http://localhost:8080/api/auth/refreshtoken', { refreshToken: refToken }).pipe(
            switchMap((tokenResponse: any) => {
              this.isRefreshing = false;
              console.log("TokenInterceptor: Token refreshed successfully", tokenResponse);
            ...

Inspect the Network traffic and pay attention to the concolse when the token expires.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
