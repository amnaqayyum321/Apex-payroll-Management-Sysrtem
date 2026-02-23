import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  url: any;
  constructor(private http: HttpClient) {
    this.url = environment.apiBaseUrl;
  }

  CreatenewDesignation(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/designations', data);
  }
  getAllDesignations(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/designations?page=${page}&size=${size}`);
  }

  // Update Designation
  updateDesignation(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/designations/${publicId}`, data);
  }

  // Soft Delete
  deleteDesignation(publicId: string): Observable<any> {
    return this.http.delete(this.url + `admin/designations/${publicId}`);
  }

  // Toggle Active
  toggleDesignationActive(publicId: string, active: boolean): Observable<any> {
    return this.http.patch(this.url + `admin/designations/${publicId}/active`, { active });
  }

  // Restore
  restoreDesignation(publicId: string): Observable<any> {
    return this.http.patch(this.url + `admin/designations/${publicId}/restore`, {});
  }

  getDesignationById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/designations/${publicId}`);
  }

  GetDepartment(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(this.url + `admin/departments?filter=${filter}&page=${page}&size=${size}`);
  }
  CreateDepartment(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/departments', data);
  }
  UpdateDepartment(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/departments/${PublicId}`, data);
  }
  getDepartementById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/departments/${publicId}`);
  }

  getAllComapnyBranches(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/company-branches?page=${page}&size=${size}`);
  }
  createCompanyBranch(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/company-branches', data);
  }
  UpdateCompanyBranch(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/company-branches/${PublicId}`, data);
  }
  getCompanyBranchById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/company-branches/${publicId}`);
  }
  GetPayperiod(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(this.url + `admin/pay-periods?filter=${filter}&page=${page}&size=${size}`);
  }

  CreatePayperiod(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/pay-periods', data);
  }
  UpdatePayperiod(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/pay-periods/${PublicId}`, data);
  }
  getPayperiodbyId(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/pay-periods/${publicId}`);
  }
  GetEmployees(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(this.url + `employees/lookup?filter=${filter}&page=${page}&size=${size}`);
  }
  GetProject(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(this.url + `admin/projects?filter=${filter}&page=${page}&size=${size}`);
  }

  CreateProject(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/projects', data);
  }
  UpdateProject(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/projects/${PublicId}`, data);
  }
  getProjectById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/projects/${publicId}`);
  }
  GetLeaveType(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(this.url + `admin/leave-types?filter=${filter}&page=${page}&size=${size}`);
  }

  CreateLeaveType(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/leave-types', data);
  }
  UpdateLeaveType(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/leave-types/${PublicId}`, data);
  }
  getLeaveTypeById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/leave-types/${publicId}`);
  }
}
