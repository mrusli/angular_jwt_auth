import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APIResponseModel } from '../model/interface/response.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/interface/api-response';
import { Page } from '../model/interface/page';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly serverUrl: string = 'http://localhost:8085';

  http = inject(HttpClient);

  constructor() { }

  getAllCustomer() {
    return this.http.get<APIResponseModel>("http://localhost:8085/api/customerbypage/all?name=&page=1&size=10");
  }

  getCustomersByAlpha(alpha: string) {
    console.log("Fetching customers starting with:", "\""+alpha+"\"");
    
    return this.http.get<APIResponseModel>("http://localhost:8085/api/customerbypage/all?alpha="+"\""+alpha+"\"");
  }

  customers$ = (name: string = ' ', page: number = 0, size: number = 10): Observable<ApiResponse<Page>> => 
    this.http.get<any>(`${this.serverUrl}/api/customerbypage/all?name=&page=1&size=10`);
  


}
