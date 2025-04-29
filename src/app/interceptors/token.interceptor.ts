import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { BehaviorSubject, catchError, finalize, Observable, switchMap, throwError } from "rxjs";

export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private http = inject(HttpClient);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    if (req.url.includes("signin")) {
      console.log("TokenInterceptor: Skipping token addition for login request");
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
        finalize(() => {
          console.log("TokenInterceptor: Request completed");
        })
      );
    }

    console.log("TokenInterceptor: No token found, forwarding request without modification");
    return next.handle(req);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = localStorage.getItem('refreshToken'); // Assuming you have a refresh token stored
      console.log("TokenInterceptor: Refreshing token using refresh token", refreshToken);
      
      if (refreshToken) {
        return this.http.post('http://localhost:8080/api/auth/refresh-token', { token: refreshToken }).pipe(
          switchMap((tokenResponse: any) => {
            const newToken = tokenResponse.accessToken; // Adjust based on your response structure
            localStorage.setItem('accessToken', newToken);

            this.refreshTokenSubject.next(newToken);
            return next.handle(req);
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
      }
    }
    return throwError(() => new Error('Refresh token is missing or request already in progress.'));
  }
}
