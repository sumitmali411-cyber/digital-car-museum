import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CountriesComponent } from './countries.component';
import { ApiService } from '../../core/services/api.service';
import { Country } from '../../shared/models/country.model';

const mockCountry: Country = {
  id: 1,
  name: 'USA',
  code: 'USA',
  flagUrl: 'https://example.com/flag.png',
  continent: 'North America',
  description: 'United States of America',
  mapLat: 37.09,
  mapLng: -95.71,
  displayOrder: 1,
  manufacturerCount: 3,
};

const mockApiService = {
  getCountries: jasmine.createSpy('getCountries').and.returnValue(of([mockCountry])),
};

describe('CountriesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesComponent],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: mockApiService },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CountriesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start in loading state', () => {
    const fixture = TestBed.createComponent(CountriesComponent);
    expect(fixture.componentInstance.loading()).toBeTrue();
  });

  it('should display country name after load', () => {
    const fixture = TestBed.createComponent(CountriesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBeFalse();
    expect(fixture.componentInstance.countries()).toEqual([mockCountry]);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('USA');
  });
});
