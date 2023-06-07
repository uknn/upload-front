import {
  ComponentFixture,
  TestBed, waitForAsync
} from '@angular/core/testing';
import { ImageAddComponent } from './image-add.component';
import { By } from '@angular/platform-browser';

describe('ImageAddComponent', () => {
  let component: ImageAddComponent;
  let fixture: ComponentFixture<ImageAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageAddComponent]
    });
    fixture = TestBed.createComponent(ImageAddComponent);
    component = fixture.componentInstance;
  }));

  const file = {
    item: jest.fn().mockReturnValue({ test : 'test'})
  } as unknown as FileList;

  describe('selectFile', () => {
    it('should call selectFile on change', () => {
      jest.spyOn(component, 'selectFile');
      fixture.detectChanges();

      const inputElDebug = fixture.debugElement.query(By.css('input[type="file"]'));
      const inputEl: HTMLInputElement = inputElDebug.nativeElement;
      const changeEvent = new Event('change');
      inputEl.dispatchEvent(changeEvent);

      fixture.detectChanges();

      expect(component.selectFile).toHaveBeenCalled();
    });
  });

  describe('upload', () => {
    it('should trigger uploadEvent when selected file has a value', () => {
      jest.spyOn(component.uploadEvent, 'emit')
      component.selectedFile = file;
      component.upload();
      expect(component.uploadEvent.emit).toHaveBeenCalled();
    });

    it('should not trigger uploadEvent when selected file is null', () => {
      jest.spyOn(component.uploadEvent, 'emit')
      component.selectedFile = null as unknown as FileList;
      component.upload();
      expect(component.uploadEvent.emit).not.toHaveBeenCalled();
    });
  });
});
