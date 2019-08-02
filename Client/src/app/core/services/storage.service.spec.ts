import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, from } from 'rxjs';
import { StorageService } from './storage.service';

describe('StorageService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({});

        const store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
               store[key] = value;
               // store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
        };

        spyOn(localStorage, 'getItem')
            .and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem')
            .and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem')
            .and.callFake(mockLocalStorage.removeItem);
    });

    it('set should call localStorage.setItem() and save the key and value', () => {
        const service: StorageService = TestBed.get(StorageService);

        service.set('key', 'value');
        const result = service.get('key');
        expect(result).toEqual('value');
    });

    it('get should call localStorage.getItem() and return null from mock object', () => {
        const service: StorageService = TestBed.get(StorageService);

        const result = service.get('key');
        expect(result).toEqual(null);
    });

    it('get should call localStorage.getItem() and return null after removing', () => {
        const service: StorageService = TestBed.get(StorageService);
        service.set('key', 'test');
        service.remove('key');

        const result = service.get('key');
        expect(result).toEqual(null);
    });

});
