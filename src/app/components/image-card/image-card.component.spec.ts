import {
  ComponentFixture,
  TestBed, waitForAsync
} from '@angular/core/testing';
import { ImageCardComponent } from './image-card.component';


describe('ImageCardComponent', () => {
  let component: ImageCardComponent;
  let fixture: ComponentFixture<ImageCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImageCardComponent]
    });
    fixture = TestBed.createComponent(ImageCardComponent);
    component = fixture.componentInstance;
  }));

  test('should exist', () => {
    expect(component).toBeDefined();
  });
});
