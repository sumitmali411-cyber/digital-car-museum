import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Country } from '../../shared/models/country.model';
import { Manufacturer } from '../../shared/models/manufacturer.model';
import {
  ApiResponse, Car, Model3D, PagedResponse, Stats
} from '../../shared/models/car.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  // ── Countries ──────────────────────────────────────────
  getCountries(): Observable<Country[]> {
    return this.http.get<ApiResponse<Country[]>>(`${this.base}/countries`)
      .pipe(map(r => r.data));
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<ApiResponse<Country>>(`${this.base}/countries/${id}`)
      .pipe(map(r => r.data));
  }

  getManufacturersByCountry(countryId: number): Observable<Manufacturer[]> {
    return this.http.get<ApiResponse<Manufacturer[]>>(`${this.base}/countries/${countryId}/manufacturers`)
      .pipe(map(r => r.data));
  }

  // ── Manufacturers ───────────────────────────────────────
  getAllManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<ApiResponse<Manufacturer[]>>(`${this.base}/manufacturers`)
      .pipe(map(r => r.data));
  }

  getManufacturer(id: number): Observable<Manufacturer> {
    return this.http.get<ApiResponse<Manufacturer>>(`${this.base}/manufacturers/${id}`)
      .pipe(map(r => r.data));
  }

  getManufacturerBySlug(slug: string): Observable<Manufacturer> {
    return this.http.get<ApiResponse<Manufacturer>>(`${this.base}/manufacturers/slug/${slug}`)
      .pipe(map(r => r.data));
  }

  getCarsByManufacturer(id: number, page = 0, size = 20, year?: number): Observable<PagedResponse<Car>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (year) params = params.set('year', year);
    return this.http.get<ApiResponse<PagedResponse<Car>>>(`${this.base}/manufacturers/${id}/cars`, { params })
      .pipe(map(r => r.data));
  }

  getTimeline(manufacturerId: number): Observable<Record<number, Car[]>> {
    return this.http.get<ApiResponse<Record<number, Car[]>>>(`${this.base}/manufacturers/${manufacturerId}/timeline`)
      .pipe(map(r => r.data));
  }

  // ── Cars ────────────────────────────────────────────────
  getCar(id: number): Observable<Car> {
    return this.http.get<ApiResponse<Car>>(`${this.base}/cars/${id}`)
      .pipe(map(r => r.data));
  }

  searchCars(params: {
    q?: string; year?: number; countryId?: number;
    fuelType?: string; bodyType?: string; manufacturerId?: number; page?: number; size?: number;
  }): Observable<PagedResponse<Car>> {
    let httpParams = new HttpParams();
    if (params.q)              httpParams = httpParams.set('q', params.q);
    if (params.year)           httpParams = httpParams.set('year', params.year);
    if (params.countryId)      httpParams = httpParams.set('countryId', params.countryId);
    if (params.fuelType)       httpParams = httpParams.set('fuelType', params.fuelType);
    if (params.bodyType)       httpParams = httpParams.set('bodyType', params.bodyType);
    if (params.manufacturerId) httpParams = httpParams.set('manufacturerId', params.manufacturerId);
    httpParams = httpParams.set('page', params.page ?? 0).set('size', params.size ?? 20);
    return this.http.get<ApiResponse<PagedResponse<Car>>>(`${this.base}/cars/search`, { params: httpParams })
      .pipe(map(r => r.data));
  }

  // ── 3D Models ───────────────────────────────────────────
  getModel3D(carId: number): Observable<Model3D> {
    return this.http.get<ApiResponse<Model3D>>(`${this.base}/cars/${carId}/model3d`)
      .pipe(map(r => r.data));
  }

  getModel3DUrl(carId: number): string {
    return `${this.base}/cars/${carId}/model3d/download`;
  }

  // ── Stats ───────────────────────────────────────────────
  getStats(): Observable<Stats> {
    return this.http.get<ApiResponse<Stats>>(`${this.base}/stats`)
      .pipe(map(r => r.data));
  }
}
