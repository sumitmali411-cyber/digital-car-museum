export interface CarColor {
  id: number;
  name: string;
  hexCode: string;
}

export interface Car {
  id: number;
  modelName: string;
  slug: string;
  year: number;
  generation: string;
  bodyType: string;
  engineType: string;
  horsepower: number;
  torque: string;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  topSpeedKmh: number;
  acceleration0100: number;
  weightKg: number;
  priceUsd: number;
  description: string;
  imageUrl: string;
  galleryUrls: string[];
  manufacturerId: number;
  manufacturerName: string;
  manufacturerSlug: string;
  manufacturerLogoUrl: string;
  countryId: number;
  countryName: string;
  countryCode: string;
  has3dModel: boolean;
  colors: CarColor[];
}

export interface Model3D {
  id: number;
  fileName: string;
  fileSizeBytes: number;
  format: string;
  polyCount: number;
  hasAnimations: boolean;
  defaultColor: string;
  source: string;
  license: string;
  attribution: string;
  carId: number;
  uploadedAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Stats {
  totalCountries: number;
  totalManufacturers: number;
  totalCars: number;
  carsWith3DModel: number;
  totalElectricCars: number;
  earliestYear: number;
  latestYear: number;
}
