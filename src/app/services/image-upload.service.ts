import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ImageResponseContent, ImageResponse } from '../models/image.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private baseUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  /**
   * Build the request and calls the backend to upload the file selected
   * @param file the file
   */
  upload(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    let params = new HttpParams();
    params = params.append('userId', this.storageService.getUser()?.id || '')
    return this.http.post(`${this.baseUrl}/create`, formData, { reportProgress: true, responseType: 'text', params })
  }

  /**
   * Build the request and calls the backend to delete the selected file
   * @param id the id
   */
  deleteImageById(id: string | undefined): Observable<ImageResponseContent | null> {
    if (id) {
      return this.http.delete<ImageResponseContent>(`${this.baseUrl}/delete/` + id);
    }
    return of(null);
  }

  /**
   * Fetch the image list
   */
  getImages(): Observable<ImageResponse> {
    let params = new HttpParams();
    params = params.append('userId', this.storageService.getUser()?.id || '')
    return this.http.get<ImageResponse>(`${this.baseUrl}/load`, { params });
  }
}
