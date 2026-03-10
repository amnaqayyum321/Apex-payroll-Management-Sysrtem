import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuVisibilityService } from './menu-visibility.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(
    private http: HttpClient,
    private menuVisibilityService: MenuVisibilityService,
  ) {}
  clearStorage() {
    localStorage.removeItem('deviceId');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  loadUserAndApplyMenu(userId: string) {
    const base = environment.apiBaseUrl;

    // Step A: Get user info → get their roleCode
    this.http.get<any>(`${base}/admin/users/${userId}`).subscribe((userRes) => {
      const roleCode = userRes.data.roleCode;
      console.log('Role Code:', roleCode); // e.g. "SUPER_ADMIN"

      // Step B: Get all roles → find matching role's publicId
      this.http.get<any>(`${base}/admin/roles`).subscribe((rolesRes) => {
        const matchedRole = rolesRes.data.find((r: any) => r.code === roleCode);
        if (!matchedRole) {
          console.warn('No matching role found for:', roleCode);
          return;
        }

        // Step C: Get role details → get permissionCodes
        this.http
          .get<any>(`${base}/admin/roles/${matchedRole.publicId}`)
          .subscribe((roleDetail) => {
            const permissions: string[] = roleDetail.data.permissionCodes;
            console.log('Permissions loaded:', permissions.length);

            // Step D: Apply to sidebar
            this.menuVisibilityService.applyPermissions(permissions);
          });
      });
    });
  }
}
