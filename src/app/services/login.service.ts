import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly serverUrl = 'https://localhost:8443';

  constructor(private http: HttpClient) { }

  login$ = (username: string, password: string): Observable<any> => 
    this.http.post(`${this.serverUrl}/api/auth/signin`, { username, password });
  
}
