import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak = new Keycloak({
    url: environment.keycloakUrl,
    realm: environment.keycloakRealm,
    clientId: environment.keycloakClientId,
  });

  readonly isAuthenticated = signal(false);
  readonly userProfile = signal<{ name: string; email: string; roles: string[] } | null>(null);

  async init(): Promise<void> {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      pkceMethod: 'S256',
    });

    this.isAuthenticated.set(authenticated);

    if (authenticated) {
      const profile = await this.keycloak.loadUserProfile();
      const roles = this.keycloak.realmAccess?.roles ?? [];
      this.userProfile.set({
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email ?? '',
        roles,
      });
    }
  }

  login(): void {
    this.keycloak.login({ redirectUri: window.location.href });
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isAdmin(): boolean {
    return this.keycloak.hasRealmRole('admin');
  }

  isCurator(): boolean {
    return this.keycloak.hasRealmRole('curator') || this.isAdmin();
  }

  async getValidToken(): Promise<string | undefined> {
    await this.keycloak.updateToken(30);
    return this.keycloak.token;
  }
}
