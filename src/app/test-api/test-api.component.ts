import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.css'
})
export class TestAPIComponent {

  http = inject(HttpClient);

  alphabets: string[] = [];
  currentAlpha: string = "A";

  constructor() {
    this.alphabets = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65));
  }

  alphaClick(alpha: string) {
    console.log(alpha);
    this.currentAlpha = alpha;
  }

  onAllClick() {
    this.http.get("https://localhost:8443/api/test/all").subscribe({
      next: (response:any) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  onUserClick() {
    this.http.get("https://localhost:8443/api/test/user").subscribe({
      next: (response:any) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  onModClick() {
    this.http.get("https://localhost:8443/api/test/mod").subscribe({
      next: (response:any) => {
        console.log(response.message);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  onAllCustomerClick() {
    this.http.get("http://localhost:8085/api/customerbypage/all").subscribe({
      next: (response:any) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error fetching data', error);
      }
    });
  }

  currentComponent : string = "Roles";

  changeTab(arg0: string) {
    this.currentComponent = arg0;
  }


}
