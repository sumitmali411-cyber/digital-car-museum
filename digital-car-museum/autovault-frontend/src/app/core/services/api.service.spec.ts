import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const base = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getCountries_makesCorrectRequest', () => {
    service.getCountries().subscribe();
    const req = httpMock.expectOne(`${base}/countries`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: [] });
  });

  it('getCountries_unwrapsApiResponse', () => {
    const mockCountries = [{ id: 1, name: 'USA', code: 'USA' }];
    let result: any;
    service.getCountries().subscribe(c => (result = c));
    httpMock.expectOne(`${base}/countries`).flush({ success: true, data: mockCountries });
    expect(result).toEqual(mockCountries);
  });

  it('getCar_makesCorrectRequest', () => {
    service.getCar(1).subscribe();
    const req = httpMock.expectOne(`${base}/cars/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: {} });
  });

  it('searchCars_includesQueryParams', () => {
    service.searchCars({ q: 'mustang', manufacturerId: 1 }).subscribe();
    const req = httpMock.expectOne(r => r.url === `${base}/cars/search`);
    expect(req.request.params.get('q')).toBe('mustang');
    expect(req.request.params.get('manufacturerId')).toBe('1');
    req.flush({ success: true, data: { content: [], totalElements: 0 } });
  });

  it('getStats_returnsStats', () => {
    const mockStats = { totalCountries: 10, totalCars: 190 };
    let result: any;
    service.getStats().subscribe(s => (result = s));
    httpMock.expectOne(`${base}/stats`).flush({ success: true, data: mockStats });
    expect(result).toEqual(mockStats);
  });

  it('getModel3DUrl_returnsCorrectStringSync', () => {
    const url = service.getModel3DUrl(42);
    expect(url).toBe(`${base}/cars/42/model3d/download`);
  });
});
