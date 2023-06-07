import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageUploadService } from '../../services/image-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageResponseContent, ImageInfo, ImageResponse } from '../../models/image.model';
import { catchError, filter, mergeMap, of, Subscription, tap } from 'rxjs';


@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit, OnDestroy {
  displayDatas: Array<ImageInfo> = [];
  currentFile?: File;
  message = '';
  subscription = new Subscription();

  constructor(private uploadService: ImageUploadService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.subscription.add(this.uploadService.getImages().subscribe((response: any)=> {
      this.displayDatas = this.buildImageList(response);
    }))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Triggered on click, delete the image selected
   * @param id of the image in mongo
   */
  delete(id: string | undefined): void {
    this.subscription.add(this.uploadService.deleteImageById(id).pipe(
      mergeMap(() => this.uploadService.getImages().pipe(
        tap((response) => this.displayDatas = this.buildImageList(response)))
      ),
      catchError((error) => {
        return of(this.logError(error));
      })
    ).subscribe());
  }

  /**
   * To log the errors, could be in a different file depending on the usage
   * @param message the error message
   */
  logError(message: string): string {
    return message;
  }

  /**
   * Triggered on click, upload the image to mongo
   * @param selectedFile the file selected
   */
  upload(selectedFile: FileList): void {
    if (selectedFile) {
      const file: File | null = selectedFile.item(0);
      if (file) {
        this.currentFile = file;
        this.subscription.add(this.uploadService.upload(this.currentFile).pipe(
          filter(Boolean),
          mergeMap(() => this.uploadService.getImages().pipe(
            tap((response) => this.displayDatas = this.buildImageList(response)))),
          catchError((error) => {
            return of(this.logError(error));
          })
        ).subscribe());
      }
    }
  }

  /**
   * Build the data needed to display the image list based on the backend response
   * @param response
   */
  buildImageList(response: ImageResponse): Array<ImageInfo> {
    const displayDataTemp: Array<ImageInfo> = []
    if (response && response.data) {
      response.data.slice().reverse().forEach((item: ImageResponseContent) => {
      //response.data.findLast((item: ImageResponseContent) => {
        const image = item;
        if (image.img && image.img.data) {
          let type_array = new Uint8Array(image.img.data.data);
          const STRING_CHAR = type_array.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
          }, '')
          let base64String = btoa(STRING_CHAR);
          const displayData = {
            url: this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + base64String),
            id: image._id,
            name: item.name,
            desc: item.desc
          }
          displayDataTemp.push(displayData);
        }
      })
    }

    return displayDataTemp;
  }
}


