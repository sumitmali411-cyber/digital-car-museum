import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'AutoVault — Digital Car Museum',
  },
  {
    path: 'countries',
    loadComponent: () => import('./features/countries/countries.component').then(m => m.CountriesComponent),
    title: 'Countries — AutoVault',
  },
  {
    path: 'countries/:id/manufacturers',
    loadComponent: () => import('./features/manufacturers/manufacturers.component').then(m => m.ManufacturersComponent),
    title: 'Manufacturers — AutoVault',
  },
  {
    path: 'manufacturers/:id',
    loadComponent: () => import('./features/manufacturers/manufacturer-detail.component').then(m => m.ManufacturerDetailComponent),
    title: 'Manufacturer — AutoVault',
  },
  {
    path: 'manufacturers/:id/timeline',
    loadComponent: () => import('./features/timeline/timeline.component').then(m => m.TimelineComponent),
    title: 'Timeline — AutoVault',
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./features/car-detail/car-detail.component').then(m => m.CarDetailComponent),
    title: 'Car Detail — AutoVault',
  },
  {
    path: 'cars/:id/viewer',
    loadComponent: () => import('./features/car-viewer-3d/car-viewer-3d.component').then(m => m.CarViewer3dComponent),
    title: '3D Viewer — AutoVault',
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(m => m.SearchComponent),
    title: 'Search — AutoVault',
  },
  { path: '**', redirectTo: '' },
];
