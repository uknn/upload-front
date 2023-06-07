import { TestBed } from '@angular/core/testing';
import { ImageUploadService } from "./image-upload.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';


describe('ImageUploadService', () => {
  let service: ImageUploadService;
  let httpTestingController: HttpTestingController;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageUploadService, StorageService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ImageUploadService);
    storageService = TestBed.inject(StorageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getImages', () => {
    it('should make a get http call ', () => {
      const userId = 'userid'
      jest.spyOn(storageService, 'getUser').mockReturnValue({ id: userId } as User)
      service.getImages().subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/load?userId='+userId);
      expect(req.request.method).toEqual('GET');
    });

    it('should make a get http call with empty Id', () => {
      service.getImages().subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/load?userId=');
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('upload', () => {
    it('should make a post http call ', () => {
      let content = 'test';
      let data = new Blob([content], { type: 'type' });
      let arrayOfBlob = new Array<Blob>();
      arrayOfBlob.push(data);
      let file = new File(arrayOfBlob, 'Mock.png', { type: 'type' });

      const expectedBody: FormData = new FormData();
      expectedBody.append('file', file, file.name);

      const userId = 'userid'
      jest.spyOn(storageService, 'getUser').mockReturnValue({ id: userId } as User)

      service.upload(file).subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/create?userId='+userId);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
    });

    it('should make a post http call with empty id', () => {
      let content = 'test';
      let data = new Blob([content], { type: 'type' });
      let arrayOfBlob = new Array<Blob>();
      arrayOfBlob.push(data);
      let file = new File(arrayOfBlob, 'Mock.png', { type: 'type' });

      const expectedBody: FormData = new FormData();
      expectedBody.append('file', file, file.name);

      service.upload(file).subscribe();
      const req = httpTestingController.expectOne('http://localhost:4000/api/create?userId=');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(expectedBody);
    });
  });

  describe('deleteImageById', () => {
    it('should make a delete http call when the id is provided', () => {
      const id = 'id';
      service.deleteImageById(id).subscribe();
      const req = httpTestingController.expectOne(`http://localhost:4000/api/delete/${id}`);
      expect(req.request.method).toEqual('DELETE');
    });

    it('should not make a delete http call when id is null', () => {
      const id = '';
      service.deleteImageById(id).subscribe();
      httpTestingController.expectNone(`http://localhost:4000/api/delete/${id}`);
    });
  });
});
