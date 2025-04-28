import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [],
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.css'
})
export class TestAPIComponent {

  http = inject(HttpClient);

  onAllClick() {
    this.http.get("http://localhost:8080/api/test/all").subscribe({
      next: (response:any) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  onUserClick() {
    this.http.get("http://localhost:8080/api/test/user").subscribe({
      next: (response:any) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  onModClick() {
    this.http.get("http://localhost:8080/api/test/mod").subscribe({
      next: (response:any) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }
}
