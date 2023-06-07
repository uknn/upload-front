import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-image-add',
  templateUrl: './image-add.component.html',
  styleUrls: ['./image-add.component.scss']
})
export class ImageAddComponent {
  selectedFile?: FileList;
  @Output() uploadEvent: EventEmitter<FileList> = new EventEmitter<FileList>();

  /**
   * Retreive the file selection from the input type="file"
   * @param event
   */
  selectFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    this.selectedFile = files;
  }

  /**
   * output the file to the parent component
   */
  upload(): void {
    if (this.selectedFile) {
      this.uploadEvent.emit(this.selectedFile);
    }
  }
}
