import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
//     console.error('Login error:', error);
//     return of({ appState: 'AUTH_ERROR', error });
//   })
// );

  loginObj : any = {
    "username": "",
    "password" : ""
  }
  
  http = inject(HttpClient);
  router = inject(Router);
  loginService = inject(LoginService);

  onLogin() {
    this.http.post("https://localhost:8443/api/auth/signin", this.loginObj).subscribe({
      next: (response:any) => {
        // console.log(response.tokenType + " " + response.accessToken);
        localStorage.clear();
        localStorage.setItem("accessToken", response.tokenType + " " + response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        this.router.navigate(["/testAPI"]);        
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }

  loginState$: Observable<{ appState: string, error?: HttpErrorResponse }>;

  ngOnInit(): void {
    this.loginState$ = of({ appState: 'AUTH_START', error: undefined });
  }

  onLogin2(): void {
    this.loginState$ = this.loginService.login$(this.loginObj.username, this.loginObj.password).pipe(
      map((response: any) => {
        if (response && response.token) {
          localStorage.setItem('accessToken', response.type + " " +response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.router.navigate(["/testAPI"]);
          return { appState: 'AUTH_SUCCESS', error: undefined };
        } else {
          return { appState: 'AUTH_ERROR', error: undefined };
        }
      }),
      startWith({ appState: 'AUTH_START', error: undefined }),
      catchError((error: HttpErrorResponse) => {
        return of({ appState: 'AUTH_ERROR', error });
      })
    );
  }

  onRetry() {
    this.loginObj.username = "";
    this.loginObj.password = "";
    this.loginState$ = of({ appState: 'AUTH_START', appData: undefined, error: undefined });
  }  
}
