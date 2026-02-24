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
  // Pay Period
  GetPayperiod(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(this.url + `admin/pay-periods?filter=${filter}&page=${page}&size=${size}`);
  }

// pay period
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
  // Project
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

  // leavetype
  // Leave Type
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

  // Shifts

  // CREATE SHIFT
  CreatenewShift(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/shifts', data);
  }
  getAllShifts(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(`${this.url}admin/shifts?filter=${filter}&page=${page}&size=${size}`);
  }
  updateShift(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/shifts/${publicId}`, data);
  }

  getShiftById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/shifts/${publicId}`);
  }

  // work schedule
  CreateWorkSchedule(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/work-schedules', data);
  }
  getAllWorkSchedules(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}admin/work-schedules?filter=${filter}&page=${page}&size=${size}`,
    );
  }
  updateWorkSchedule(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/work-schedules/${publicId}`, data);
  }

  getWorkScheduleById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/work-schedules/${publicId}`);
  }
  // Pay Element
  GetPayElement(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      this.url + `admin/pay-elements?filter=${filter}&page=${page}&size=${size}`,
    );
  }

  CreatePayElement(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/pay-elements', data);
  }
  UpdatePayElement(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/pay-elements/${PublicId}`, data);
  }
  getPayElementById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/pay-elements/${publicId}`);
  }
  // Employee Category
  GetEmployeeCaterogy(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      this.url + `admin/employee-categories?filter=${filter}&page=${page}&size=${size}`,
    );
  }

  CreateEmployeeCaterogy(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/employee-categories', data);
  }
  UpdateEmployeeCaterogy(PublicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/employee-categories/${PublicId}`, data);
  }
  getEmployeeCaterogyById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/employee-categories/${publicId}`);
  }
  }

  // leave entitlements
  GetEmployeesForLeaveEntilements(page: number, size: number): Observable<any>{
    return this.http.get(this.url + `employees?page=${page}&size=${size}` )
  }

    CreateLeaves(data: any): Observable<any> {
    return this.http.post(this.url + 'admin/leave-entitlements', data);
  }
  getAllLeaves(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}admin/leave-entitlements?filter=${filter}&page=${page}&size=${size}`,
    );
  }
  updateLeaves(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `admin/leave-entitlements/${publicId}`, data);
  }

  getWorkLeavesById(publicId: string): Observable<any> {
    return this.http.get(this.url + `admin/leave-entitlements/${publicId}`);
  }
  getLeaveEntitlementById(publicId: string): Observable<any> {
  return this.http.get(this.url + `admin/leave-entitlements/${publicId}`);
}
}
