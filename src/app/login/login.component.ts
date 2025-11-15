import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj : any = {
    "username": "",
    "password" : ""
  }
  
  http = inject(HttpClient);
  router = inject(Router);
  
  onLogin() {
    this.http.post("https://localhost:8443/api/auth/signin", this.loginObj).subscribe({
      next: (response:any) => {
        // console.log("token: " + response.token);
        localStorage.clear();
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("refreshToken", response.refreshToken);

        this.router.navigate(["/testAPI"]);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
