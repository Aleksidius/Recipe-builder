import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { of } from 'rxjs';


describe('AuthService', () => {
  const http = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  const storage = jasmine.createSpyObj('StorageService', ['get', 'set', 'remove']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: http,
      },
      {
        provide: StorageService,
        useValue: storage,
      }
    ]
  }));


  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });


  it('register should call http.post', () => {

    const service: AuthService = TestBed.get(AuthService);
    http.post.calls.reset();

    service.register('test', 'test', 'test', 'test', 'test');

    expect(http.post).toHaveBeenCalled();
  });


  it('register should call http.post only once', () => {

    const service: AuthService = TestBed.get(AuthService);
    http.post.calls.reset();
    service.register('test', 'test', 'test', 'test', 'test');

    expect(http.post).toHaveBeenCalledTimes(1);
  });

  it('register should call http.post with correct object', () => {
    const service: AuthService = TestBed.get(AuthService);
    http.post.calls.reset();

    service.register('test1', 'test2', 'test3', 'test4', 'test5');

    expect(http.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/register',
      {
        username: 'test1',
        password: 'test2',
        email: 'test3',
        firstName: 'test4',
        lastName: 'test5',
      });
  });

  it('register should return correct test object', () => {

    const service: AuthService = TestBed.get(AuthService);
    http.post.and.returnValue(of({ test: 'test' }));

    service.register('test1', 'test2', 'test3', 'test4', 'test5').subscribe(
      (res: any) => {
        expect(res.test).toBe('test');
      }
    );
  });


  it('login should call http.post', () => {

    const service: AuthService = TestBed.get(AuthService);
    http.post.calls.reset();

    service.login('test', 'test');

    expect(http.post).toHaveBeenCalled();
  });


  it('login should call http.post only once', () => {

    const service: AuthService = TestBed.get(AuthService);
    http.post.calls.reset();

    service.login('test', 'test');

    expect(http.post).toHaveBeenCalledTimes(1);
  });


  it('login should call http.post with correct object', () => {
    const service: AuthService = TestBed.get(AuthService);
    http.post.calls.reset();

    service.login('test1', 'test2');

    expect(http.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/login',
      {
        username: 'test1',
        password: 'test2',
      });
  });


  it('login should return correct test object', () => {

    const service: AuthService = TestBed.get(AuthService);
    http.post.and.returnValue(of({
      test: 'test',
      // tslint:disable-next-line:max-line-length
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiQWFhYWExISIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE1NjExOTc2ODksImV4cCI6MTU2MTgwMjQ4OX0.NvAd0wIGD55XaROjtWNE6VnLbn7K9jOafquWdhYpKQA'
    }));

    service.login('test', 'test').subscribe(
      (res: any) => {
        expect(res.test).toBe('test');
      }
    );
  });


  it('login should call storage.set 3 times', () => {

    http.post.and.returnValue(of({
      // tslint:disable-next-line:max-line-length
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiQWFhYWExISIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE1NjExOTc2ODksImV4cCI6MTU2MTgwMjQ4OX0.NvAd0wIGD55XaROjtWNE6VnLbn7K9jOafquWdhYpKQA',
    }));

    const service: AuthService = TestBed.get(AuthService);
    storage.set.calls.reset();

    service.login('test', 'test').subscribe(

      () => {
        expect(storage.set).toHaveBeenCalledTimes(3);
      }
    );
  });

  it('login should log the user in', () => {

    http.post.and.returnValue(of({
      // tslint:disable-next-line:max-line-length
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikpvcm8iLCJpYXQiOjE1NjQyNDYxNzksImV4cCI6MTU2NDg1MDk3OX0.hATcYTbFMEZjSCVu5Uu98sBvMm2oht-mNDkd37B5ll4',
    }));

    const service: AuthService = TestBed.get(AuthService);

    service.login('test', 'test').subscribe(

      (result) => {
        expect((service.tokenPeyloadReader(result.token)).username).toBe('Joro');
      }
    );
  });

  it('login should log the user in', () => {

    http.post.and.returnValue(of({
      // tslint:disable-next-line:max-line-length
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikpvcm8iLCJpYXQiOjE1NjQyNDYxNzksImV4cCI6MTU2NDg1MDk3OX0.hATcYTbFMEZjSCVu5Uu98sBvMm2oht-mNDkd37B5ll4',
    }));

    const service: AuthService = TestBed.get(AuthService);

    service.login('test', 'test').subscribe(
      () => {
        service.user$.subscribe(
          (username) => expect(username).toBe('Joro')
        );
      }
    );
  });

  it('login should call storage.set with correcr token test value', () => {

    http.post.and.returnValue(of({
      // tslint:disable-next-line:max-line-length
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiQWFhYWExISIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE1NjExOTc2ODksImV4cCI6MTU2MTgwMjQ4OX0.NvAd0wIGD55XaROjtWNE6VnLbn7K9jOafquWdhYpKQA',
    }));

    const service: AuthService = TestBed.get(AuthService);

    service.login('test', 'test').subscribe(

      (res) => {
        expect(storage.set).toHaveBeenCalledWith('token',
          // tslint:disable-next-line:max-line-length
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiQWFhYWExISIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE1NjExOTc2ODksImV4cCI6MTU2MTgwMjQ4OX0.NvAd0wIGD55XaROjtWNE6VnLbn7K9jOafquWdhYpKQA'
        );
      }
    );
  });


  it(`logout should call storage.remove`, () => {
    const service: AuthService = TestBed.get(AuthService);
    storage.remove.calls.reset();

    service.logout();

    expect(storage.remove).toHaveBeenCalled();
  });


  it(`logout should call storage.remove 3 times`, () => {
    const service: AuthService = TestBed.get(AuthService);
    storage.remove.calls.reset();

    service.logout();

    expect(storage.remove).toHaveBeenCalledTimes(3);
  });


  it(`logout should call storage.remove with token`, () => {
    const service: AuthService = TestBed.get(AuthService);

    service.logout();

    expect(storage.remove).toHaveBeenCalledWith('token');
  });


  it(`logout should call storage.remove with username`, () => {
    const service: AuthService = TestBed.get(AuthService);

    service.logout();

    expect(storage.remove).toHaveBeenCalledWith('username');
  });


  it(`logout should call storage.remove with recipe`, () => {
    const service: AuthService = TestBed.get(AuthService);

    service.logout();

    expect(storage.remove).toHaveBeenCalledWith('recipe');
  });


  it(`logout should change the subject to <null>`, () => {
    const service: AuthService = TestBed.get(AuthService);

    service.logout();

    service.user$.subscribe((username) => expect(username).toBe(null));
  });


  it('tokenPeyloadLogger() should decoded token properly', () => {
    const service: AuthService = TestBed.get(AuthService);

    storage.get.and.returnValue(
      // tslint:disable-next-line:max-line-length
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiQWFhYWExISIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE1NjExOTc2ODksImV4cCI6MTU2MTgwMjQ4OX0.NvAd0wIGD55XaROjtWNE6VnLbn7K9jOafquWdhYpKQA'
    );

    const result: any = service.tokenPeyloadLogger();

    expect(result.name).toBe('test');
  });


  it('tokenPeyloadReader() should decoded token properly name-test', () => {
    const service: AuthService = TestBed.get(AuthService);

    const result: any = service.tokenPeyloadReader(
      // tslint:disable-next-line:max-line-length
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiQWFhYWExISIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJpYXQiOjE1NjExOTc2ODksImV4cCI6MTU2MTgwMjQ4OX0.NvAd0wIGD55XaROjtWNE6VnLbn7K9jOafquWdhYpKQA'
    );

    expect(result.name).toBe('test');
  });


  it('tokenPeyloadReader() should decoded token properly username-Joro', () => {
    const service: AuthService = TestBed.get(AuthService);

    const result: any = service.tokenPeyloadReader(
      // tslint:disable-next-line:max-line-length
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikpvcm8iLCJpYXQiOjE1NjQyNDYxNzksImV4cCI6MTU2NDg1MDk3OX0.hATcYTbFMEZjSCVu5Uu98sBvMm2oht-mNDkd37B5ll4'
    );

    expect(result.username).toBe('Joro');
  });

});
