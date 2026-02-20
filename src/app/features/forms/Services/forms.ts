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
  return this.http.patch(
    this.url + `admin/designations/${publicId}/active`,
    { active }
  );
}

// Restore
restoreDesignation(publicId: string): Observable<any> {
  return this.http.patch(
    this.url + `admin/designations/${publicId}/restore`,
    {}
  );
}

getDesignationById(publicId: string): Observable<any> {
  return this.http.get(this.url + `admin/designations/${publicId}`);
}

}
