import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CarCardComponent } from './car-card.component';
import { Car } from '../../models/car.model';

const mockCar: Car = {
  id: 1,
  modelName: 'Mustang',
  slug: 'mustang',
  year: 1965,
  generation: 'Gen 1',
  bodyType: 'Coupe',
  engineType: '4.7L V8',
  horsepower: 271,
  torque: '422 Nm',
  transmission: 'Manual 4-speed',
  drivetrain: 'RWD',
  fuelType: 'Gasoline',
  topSpeedKmh: 190,
  acceleration0100: 0,
  weightKg: 1309,
  priceUsd: 2372,
  description: 'Iconic pony car.',
  imageUrl: 'https://example.com/mustang.jpg',
  galleryUrls: [],
  manufacturerId: 1,
  manufacturerName: 'Ford',
  manufacturerSlug: 'ford',
  manufacturerLogoUrl: '',
  countryId: 1,
  countryName: 'USA',
  countryCode: 'USA',
  has3dModel: true,
  colors: [],
};

describe('CarCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function createComponent(car: Car = mockCar) {
    const fixture = TestBed.createComponent(CarCardComponent);
    fixture.componentInstance.car = car;
    fixture.detectChanges();
    return fixture;
  }

  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  it('should display model name', () => {
    const compiled = createComponent().nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Mustang');
  });

  it('should display manufacturer name', () => {
    const compiled = createComponent().nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ford');
  });

  it('should show 3D badge when has3dModel true', () => {
    const compiled = createComponent().nativeElement as HTMLElement;
    expect(compiled.querySelector('.badge--3d')).toBeTruthy();
  });

  it('should hide 3D badge when has3dModel false', () => {
    const fixture = createComponent({ ...mockCar, has3dModel: false });
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.badge--3d')).toBeFalsy();
  });

  it('should display year', () => {
    const compiled = createComponent().nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1965');
  });

  it('should fallback image on error', () => {
    const fixture = createComponent();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    const errorEvent = new Event('error');
    img.dispatchEvent(errorEvent);
    expect(img.src).toContain('placeholder-car.jpg');
  });
});
