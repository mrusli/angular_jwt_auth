import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent {
  fileName: string = '';
  message: string = '';

  downloadFile(): void {
    
  }

}
