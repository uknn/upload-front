import {
  ComponentFixture,
  TestBed, waitForAsync
} from '@angular/core/testing';
import { ImageListComponent } from './image-list.component';
import { ImageUploadService } from '../../services/image-upload.service';
import { ImageResponseContent, ImageInfo, ImageResponse } from '../../models/image.model';
import { ImageAddComponent } from '../image-add/image-add.component';
import { of, Subscription, throwError } from 'rxjs';


const mockImageUploadService = {
  upload: jest.fn(),
  deleteImageById: jest.fn(),
  getImages: jest.fn()
}

describe('ImageListComponent', () => {
  let component: ImageListComponent;
  let fixture: ComponentFixture<ImageListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ImageUploadService, useValue: mockImageUploadService }],
      declarations: [ ImageListComponent, ImageAddComponent ]
    });
    fixture = TestBed.createComponent(ImageListComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(component).toBeDefined();
  });

  describe('onInit', () => {
    it('should call buildImageList when a value is returned', () => {
      const buildImageListSpy = jest.spyOn(component, 'buildImageList');
      mockImageUploadService.getImages.mockReturnValue(of(true));
      component.ngOnInit();
      expect(buildImageListSpy).toHaveBeenCalled();
    });
  })

  describe('onDestroy', () => {
    it('should call unsubscribe', () => {
      jest.spyOn(Subscription.prototype, 'unsubscribe');
      component.ngOnDestroy();
      expect(Subscription.prototype.unsubscribe).toHaveBeenCalled();
    });
  })

  describe('buildImageList', () => {
    it('should return an empty array if the response is empty', () => {
      const value = component.buildImageList({} as ImageResponse);
      expect(value).toEqual([]);
    });

    it('should return an empty array if the response image is empty', () => {
      const image = [{
        data: {
          name: 'name',
          desc: 'desc',
        }
      }];
      const value = component.buildImageList(image as unknown as ImageResponse);
      expect(value).toEqual([]);
    });

    it('should return an array of ImageModel', () => {
      const image: ImageResponse = {
        data: [{
          name: 'name',
          desc: 'desc',
          img: {
            data: {
              data: [1, 1, 1, 1, 1, 1, 1, 1],
              type: 'Buffer'
            },
            contentType: 'type'
          }
        }]
      }
      const value = component.buildImageList(image);

      const expectedValue: ImageInfo[] = [{
        url: {
          changingThisBreaksApplicationSecurity: 'data:image/jpg;base64, AQEBAQEBAQE='
        },
        name: 'name',
        desc: 'desc',
        id: undefined
      }]
      expect(value.length).toEqual(1);
      expect(value).toEqual(expectedValue);
    });
  })

  describe('delete', () => {
    const imageContent: ImageResponseContent = {
      desc: 'desc',
      name: 'img',
      img: {
        data: {
          data: [1, 1, 1, 1, 1, 1],
          type: 'type'
        },
        contentType: 'content'
      }
    }

    it('should call buildImageList when a value is returned', () => {
      const buildImageListSpy = jest.spyOn(component, 'buildImageList');
      mockImageUploadService.deleteImageById.mockReturnValue(of(true));
      mockImageUploadService.getImages.mockReturnValue(of(imageContent));
      component.delete('id');
      expect(buildImageListSpy).toHaveBeenCalledWith(imageContent);
    });


    it('should call logError when getImages fails', () => {
      const error = 'Get images error';

      const logErrorSpy = jest.spyOn(component, 'logError');
      mockImageUploadService.deleteImageById.mockReturnValue(of(true));
      mockImageUploadService.getImages.mockReturnValue(throwError(() => error));

      component.delete('id');
      expect(logErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should call logError when deleteImageById fails', () => {
      const error = 'Delete image error4';

      const logErrorSpy = jest.spyOn(component, 'logError');
      mockImageUploadService.getImages.mockReturnValue(of(null));
      mockImageUploadService.deleteImageById.mockReturnValue(throwError(() => error));

      component.delete('id');
      expect(logErrorSpy).toHaveBeenCalledWith(error);
    });
  })

  describe('upload', () => {
    const imageContent: ImageResponseContent = {
      desc: 'desc',
      name: 'img',
      img: {
        data: {
          data: [1, 1, 1, 1, 1, 1],
          type: 'type'
        },
        contentType: 'content'
      }
    }

    const file = {
      item: jest.fn().mockReturnValue({ test : 'test'})
    } as unknown as FileList;

    it('should call buildImageList when a value is returned', () => {
      const buildImageListSpy = jest.spyOn(component, 'buildImageList');
      mockImageUploadService.upload.mockReturnValue(of(true));
      mockImageUploadService.getImages.mockReturnValue(of(imageContent));
      component.upload(file);
      expect(buildImageListSpy).toHaveBeenCalledWith(imageContent);
    });

    it('should call logError when getImages fails', () => {
      const error = 'Get images error';

      const logErrorSpy = jest.spyOn(component, 'logError');
      mockImageUploadService.upload.mockReturnValue(of(true));
      mockImageUploadService.getImages.mockReturnValue(throwError(() => error));

      component.upload(file);
      expect(logErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should call logError when deleteImageById fails', () => {
      const error = 'Delete image error4';

      const logErrorSpy = jest.spyOn(component, 'logError');
      mockImageUploadService.getImages.mockReturnValue(of(null));
      mockImageUploadService.upload.mockReturnValue(throwError(() => error));

      component.upload(file);
      expect(logErrorSpy).toHaveBeenCalledWith(error);
    });
  })
});
