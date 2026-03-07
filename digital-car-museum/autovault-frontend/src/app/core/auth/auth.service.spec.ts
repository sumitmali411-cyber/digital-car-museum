import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated_falseInitially', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('login_callsKeycloakLogin', () => {
    const keycloak = (service as any).keycloak;
    spyOn(keycloak, 'login').and.returnValue(Promise.resolve());
    service.login();
    expect(keycloak.login).toHaveBeenCalled();
  });

  it('logout_callsKeycloakLogout', () => {
    const keycloak = (service as any).keycloak;
    spyOn(keycloak, 'logout').and.returnValue(Promise.resolve());
    service.logout();
    expect(keycloak.logout).toHaveBeenCalled();
  });

  it('isAdmin_trueWhenRolePresent', () => {
    const keycloak = (service as any).keycloak;
    spyOn(keycloak, 'hasRealmRole').and.returnValue(true);
    expect(service.isAdmin()).toBeTrue();
  });
});
