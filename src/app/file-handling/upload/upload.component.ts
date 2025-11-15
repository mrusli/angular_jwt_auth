import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  file: File | null = null;
  fileName: string = '';
  fileSize: number = 0;
  fileType: string = '';

  fileService = inject(FileService);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileName = this.file.name;
      this.fileSize = this.file.size;
      this.fileType = this.file.type;
    }
  }

  onUpload(): void {
    if (this.file) {
      this.fileService.uploadFile(this.file)
        .then(response => {
          console.log('File uploaded successfully:', response);
          alert('File uploaded successfully!');
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
        });
    } else {
      alert('Please select a file to upload.');
    }

    // if (this.file) {
    //   const formData = new FormData();
    //   formData.append('file', this.file, this.file.name);

    //   // Simulate file upload
    //   setTimeout(() => {
    //     console.log('File uploaded:', this.file);
    //     alert('File uploaded successfully!');
    //   }, 1000);
    // } else {
    //   alert('Please select a file to upload.');
    // } 


  }

}
