import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { ApiService } from '../../core/services/api.service';
import { Stats } from '../../shared/models/car.model';

const mockStats: Stats = {
  totalCountries: 10,
  totalManufacturers: 31,
  totalCars: 190,
  carsWith3DModel: 5,
  totalElectricCars: 20,
  earliestYear: 1906,
  latestYear: 2024,
};

const mockApiService = {
  getStats: jasmine.createSpy('getStats').and.returnValue(of(mockStats)),
};

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: mockApiService },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set stats signal after load', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.stats()).toEqual(mockStats);
  });

  it('should render explore button', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/countries"]')).toBeTruthy();
  });
});
