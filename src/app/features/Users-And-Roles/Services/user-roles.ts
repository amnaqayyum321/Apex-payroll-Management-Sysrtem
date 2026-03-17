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
  CreateApprovalTemplate(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/approval-templates', data);
  }
  getApprovaLTemplate(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/approval-templates?page=${page}&size=${size}`);
  }
  GetApprovalTempByPublicId(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/approval-templates/${publicId}`);
  }
  UpdateApprovalTempByPublicId(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/approval-templates/${publicId}`, data);
  }
  CreateApprovalStages(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/approval-stages', data);
  }
  getApprovaLStages(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/approval-stages?page=${page}&size=${size}`);
  }

  // ================= APPROVAL STAGES =================
  getAllApprovalStages(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}admin/approval-stages?filter=${filter}&page=${page}&size=${size}`,
    );
  }

  getApprovalStageById(publicId: string): Observable<any> {
    return this.http.get(`${this.url}admin/approval-stages/${publicId}`);
  }

  createApprovalStage(data: any): Observable<any> {
    return this.http.post(`${this.url}admin/approval-stages`, data);
  }

  updateApprovalStage(publicId: string, data: any): Observable<any> {
    return this.http.put(`${this.url}admin/approval-stages/${publicId}`, data);
  }
  activateApprovalTemplate(publicId: string): Observable<any> {
    return this.http.patch(this.url + `admin/approval-templates/${publicId}/activate`, {});
  }
}
