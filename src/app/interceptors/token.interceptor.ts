import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from "rxjs";

export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqUrl = ["signin", "signup", "refreshtoken"];
    const containsAny = reqUrl.some((url) => req.url.includes(url));
    if (containsAny) {
      console.log("TokenInterceptor: Skipping token addition for login, refreshtoken, signup request");
      return next.handle(req); // Ensure a return statement in all cases
    }
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', token)
      });
      console.log("TokenInterceptor: Adding token to request", 
        cloned.headers.get('Authorization'));
      
      return next.handle(cloned).pipe(
        catchError((error) => {
          console.error('Error occurred while handling request', error);
          if (error.status === 401) {
            return this.handle401Error(req, next);          // Handle 401 error here if needed
          } 
          
          return throwError(() => error);
        }),
        // finalize(() => {
        //   console.log("TokenInterceptor: Request completed");
        // })
      );
    }

    console.log("TokenInterceptor: No token found, forwarding request without modification");
    return next.handle(req);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refToken = localStorage.getItem('refreshToken'); // Assuming you have a refresh token stored
      console.log("TokenInterceptor: Refreshing token using refresh token", refToken);
      
      if (refToken) {
        return this.http.post('http://localhost:8080/api/auth/refreshtoken', { refreshToken: refToken }).pipe(
          switchMap((tokenResponse: any) => {
            this.isRefreshing = false;
            console.log("TokenInterceptor: Token refreshed successfully", tokenResponse);
            
            const newToken = tokenResponse.accessToken; // Adjust based on your response structure
            
            localStorage.clear();
            localStorage.setItem("accessToken", tokenResponse.tokenType + " " + tokenResponse.accessToken);
            localStorage.setItem("refreshToken", tokenResponse.refreshToken);

            this.refreshTokenSubject.next(tokenResponse );
            return next.handle(req);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            console.error('Error occurred while refreshing token', error);
            return throwError(() => error);
          })
          // finalize(() => {
          //   this.isRefreshing = false;
          // })
        );
      } 
    }
    
    return throwError(() => new Error('Refresh token is missing or request already in progress.'));
  }
}
