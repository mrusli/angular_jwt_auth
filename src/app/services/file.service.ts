import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8085/api/customer';

  constructor() { }

  uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('File upload failed');
      }
      return response.json();
    });
  }

  download(fileName: string): Promise<void> {
    return fetch(`${this.baseUrl}/download/${fileName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('File download failed');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
}
