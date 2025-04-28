import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  onLogin() {
    this.http.post("http://localhost:8080/api/auth/signin", this.loginObj).subscribe({
      next: (response:any) => {
        // console.log(response.tokenType + " " + response.accessToken);
        localStorage.clear();
        localStorage.setItem("accessToken", response.tokenType + " " + response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
}
