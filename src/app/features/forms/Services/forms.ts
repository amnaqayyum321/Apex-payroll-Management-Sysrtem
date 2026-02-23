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
  // designation
  CreatenewDesignation(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/designations', data);
  }
  getAllDesignations(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}admin/designations?filter=${filter}&page=${page}&size=${size}`,
    );
  }
  updateDesignation(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/designations/${publicId}`, data);
  }

  getDesignationById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/designations/${publicId}`);
  }

  // Department

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

  // Company Branches
  getAllComapnyBranches(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}admin/company-branches?filter=${filter}&page=${page}&size=${size}`,
    );
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
  GetPayperiod(page: number, size: number): Observable<any> {
    return this.http.get(this.url + `admin/pay-periods?page=${page}&size=${size}`);
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
}
