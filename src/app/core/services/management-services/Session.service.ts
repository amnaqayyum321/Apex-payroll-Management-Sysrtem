import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuVisibilityService } from './menu-visibility.service';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

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
    this.menuVisibilityService.resetMenu();
  }
  //   loadUserAndApplyMenu(userId: string): Observable<any> {
  //     const base = environment.apiBaseUrl;

  //     return this.http.get<any>(`${base}admin/users/${userId}`).pipe(
  //       switchMap((userRes) => {
  //         const roleCode = userRes.data.roleCode;

  //         return this.http.get<any>(`${base}admin/roles`).pipe(
  //           switchMap((rolesRes) => {
  //             const matchedRole = rolesRes.data.find((r: any) => r.code === roleCode);

  //             if (!matchedRole) {
  //               console.warn('No matching role for:', roleCode);
  //               throw new Error('No matching role');
  //             }

  //             return this.http.get<any>(`${base}admin/roles/${matchedRole.publicId}`);
  //           }),
  //         );
  //       }),
  //     );
  //   }
  loadUserAndApplyMenu(): Observable<any> {
    const base = environment.apiBaseUrl;
    const token = localStorage.getItem('token');
    if (!token) {
      this.menuVisibilityService.applyPermissions([]);
      return new Observable((obs) => obs.complete());
    }
    return this.http.get<any>(`${base}auth/me`).pipe(
      tap((res: any) => {
        const permissions: string[] = res.data.effectivePermissions;
        this.menuVisibilityService.applyPermissions(permissions);
      }),
      catchError((err) => {
        //  401/400 aaye to token clear karo aur login pe bhejo
        if (err.status === 401 || err.status === 400) {
          this.clearStorage();
          // router inject karo ya event emit karo
          window.location.href = '/login';
        }
        return throwError(() => err);
      }),
    );
  }
  clearMenu() {
    this.menuVisibilityService.applyPermissions([]);
  }
}
