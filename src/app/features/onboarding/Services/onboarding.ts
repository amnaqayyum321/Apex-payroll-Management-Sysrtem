import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  url: any;
  constructor(private http: HttpClient) {
    this.url = environment.apiBaseUrl;
  }
  // CANDIDATE APPLICATION
  CreatenewCandidateApplication(data: any): Observable<any> {
    return this.http.post(this.url + 'recruitment/applications', data);
  }
  getAllCandidateApplications(page: number, size: number, status?: string): Observable<any> {
    let url = `${this.url}recruitment/applications?page=${page}&size=${size}`;

    if (status) {
      url += `&status=${status}`;
    }

    return this.http.get(url);
  }
  updateCandidateApplication(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `recruitment/applications/${publicId}`, data);
  }

  updateApplicationStatus(publicId: string, status: string) {
    return this.http.patch(
      `${this.url}recruitment/applications/${publicId}/status?status=${status}`,
      {},
    );
  }

  getCandidateApplicationById(publicId: string): Observable<any> {
    return this.http.get(this.url + `recruitment/applications/${publicId}`);
  }

  // INTERVIEWS
  CreatenewInterviews(data: any): Observable<any> {
    return this.http.post(this.url + 'recruitment/interviews', data);
  }
  getAllInterviews(page: number, size: number): Observable<any> {
    return this.http.get(`${this.url}recruitment/interviews?&page=${page}&size=${size}`);
  }
  updateInterviews(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `recruitment/interviews/${publicId}`, data);
  }
  updateInterviewsStatus(publicId: string, status: string): Observable<any> {
    return this.http.patch(
      this.url + `recruitment/interviews/${publicId}/status?status=${status}`,
      {},
    );
  }

  getInterviewsById(applicationPublicId: string): Observable<any> {
    return this.http.get(this.url + `recruitment/interviews/${applicationPublicId}`);
  }

  // INTERVIEW PANEL
  CreatenewInterviewPanel(data: any): Observable<any> {
    return this.http.post(this.url + 'recruitment/interview-panels', data);
  }
  getAllInterviewPanel(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}recruitment/interview-panels?filter=${filter}&page=${page}&size=${size}`,
    );
  }
  updateInterviewPanel(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `recruitment/interview-panels/${publicId}`, data);
  }

  getInterviewPanelById(publicId: string): Observable<any> {
    return this.http.get(this.url + `recruitment/interview-panels/${publicId}`);
  }

  // OFFERS
  CreatenewOffer(data: any): Observable<any> {
    return this.http.post(this.url + 'recruitment/offers', data);
  }
  getAllOffer(page: number, size: number, status?: string) {
    let url = `${this.url}recruitment/offers?page=${page}&size=${size}`;

    if (status) {
      url += `&status=${status}`;
    }

    return this.http.get(url);
  }
  updateOffer(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `recruitment/offers/${publicId}`, data);
  }

  getOfferById(publicId: string): Observable<any> {
    return this.http.get(this.url + `recruitment/offers/${publicId}`);
  }
  updateOfferStatus(publicId: string, status: string) {
    return this.http.patch(`${this.url}recruitment/offers/${publicId}/status?status=${status}`, {});
  }

  // CANDIDATES
  CreatenewCandidate(data: any): Observable<any> {
    return this.http.post(this.url + 'recruitment/candidates', data);
  }
  getAllCandidate(page: number, size: number, filter: string = 'ALL'): Observable<any> {
    return this.http.get(
      `${this.url}recruitment/candidates?filter=${filter}&page=${page}&size=${size}`,
    );
  }
  updateCandidate(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `recruitment/candidates/${publicId}`, data);
  }

  getCandidateById(publicId: string): Observable<any> {
    return this.http.get(this.url + `recruitment/candidates/${publicId}`);
  }

  // INTERVIEWS
  CreatenewJobRequisition(data: any): Observable<any> {
    return this.http.post(this.url + 'recruitment/job-requisitions', data);
  }
  getAllJobRequisition(page: number, size: number): Observable<any> {
    return this.http.get(`${this.url}recruitment/job-requisitions?page=${page}&size=${size}`);
  }
  updateJobRequisition(publicId: string, data: any): Observable<any> {
    return this.http.put(this.url + `recruitment/job-requisitions/${publicId}`, data);
  }

  getJobRequisitionById(publicId: string): Observable<any> {
    return this.http.get(this.url + `recruitment/job-requisitions/${publicId}`);
  }

  updateRequisitionStatus(publicId: string, status: string) {
    return this.http.patch(
      `${this.url}recruitment/job-requisitions/${publicId}/status?status=${status}`,
      {},
    );
  }
  CreatenInterviewsFeedback(sessionPublicId: string, data: any): Observable<any> {
    return this.http.post(
      this.url + `recruitment/interview-feedback/sessions/${sessionPublicId}`,
      data,
    );
  }

  getMyFeedback(sessionPublicId: string): Observable<any> {
    return this.http.get(
      this.url + `recruitment/interview-feedback/sessions/${sessionPublicId}/mine`,
    );
  }

  getAllFeedbackBySession(sessionPublicId: string): Observable<any> {
    return this.http.get(
      this.url + `recruitment/interview-feedback/sessions/${sessionPublicId}/all`,
    );
  }

  getMyPendingFeedback(page?: number, size?: number): Observable<any> {
    return this.http.get(
      this.url + `recruitment/interview-feedback/my-pending?page=${page}&size=${size}`,
    );
  }
  uploadAttachment(formData: FormData, params: HttpParams): Observable<any> {
    return this.http.post('storage/attachments/linked', formData, { params });
  }
  downloadAttachment(publicId: string): Observable<any> {
    return this.http.get(`storage/attachments/${publicId}/download-url`);
  }
}
