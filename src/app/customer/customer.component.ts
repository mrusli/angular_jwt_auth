import { Component, inject, OnInit } from '@angular/core';
import { Customer } from '../model/class/customer';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import { ApiResponse } from '../model/interface/api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { Page } from '../model/interface/page';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  
  alphabets: string[] = [];
  customerList: Customer[] = [];
  customerService = inject(CustomerService);
  currentAlpha: string = "All";

  customerState$: Observable<{ appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse }>;
  responseSubject = new BehaviorSubject<ApiResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();

  ngOnInit(): void {
    this.loadCustomerList();
    // this.loadAlphabet();
  }

  loadAlphabet() {
    this.alphabets = Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65));
    this.alphabets.unshift('All');
    console.log(this.alphabets);
  }

  alphaClick(alpha: string) {
    console.log("Filter by alphabet:", alpha);
    this.currentAlpha = alpha;
    if (this.currentAlpha==='All') {
      this.loadCustomerList();
    } else {
      this.customerService.getCustomersByAlpha(alpha).subscribe({
        next: (response) => {
          this.customerList = response.data.page.content;
        },
        error: (error) => {
          console.log('Error fetching customer data', error);
        }
      });      
    }
  }

  loadCustomerList() {
    this.customerState$ = this.customerService.customers$().pipe(
      map((response: ApiResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.data.page.number);

        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) => 
        of({ appState: 'APP_ERROR', error })
      )
    );
    // this.customerService.getAllCustomer().subscribe({
    //   next: (response) => {
    //     this.customerList = response.data.page.content;
    //     console.log(this.customerList);
    //   },
    //   error: (error) => {
    //     console.error('Error fetching customer data', error);
    //   }
    // });
  }

  editCustomer(id: number) {
    console.log("Edit customer with ID:", id);
    // Implement edit functionality here
  }

  gotoPage(pageNumber: number = 0): void {
    console.log("Navigating to page:", pageNumber);
    this.customerState$ = this.customerService.customers$('', pageNumber).pipe(
      map((response: ApiResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(pageNumber);

        return { appState: 'APP_LOADED', appData: response };
      }),
      startWith({ appState: 'APP_LOADING', appData: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error }))
    );
  }
}
