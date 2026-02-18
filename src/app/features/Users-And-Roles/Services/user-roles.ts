import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersAndRolesService {
  url: any;
  constructor(private http: HttpClient) {
    this.url = environment.apiBaseUrl;
  }
  getAllUser(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/users?page=${page}&size=${size}`);
  }
  CreatenewUser(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/users', data);
  }
  getRoles(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/roles?page=${page}&size=${size}`);
  }
  GetpermissionRole(): Observable<any> {
    return this.http.get(this.url + 'admin/roles/permissions');
  }
  CreateRolePermission(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/roles', data);
  }
  GetRoleByPublicId(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/roles/${publicId}`);
  }
  UpdateRoleByPublicId(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/roles/${publicId}`, data);
  }
}
