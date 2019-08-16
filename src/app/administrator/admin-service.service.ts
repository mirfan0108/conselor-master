import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private  httpClient:  HttpClient) { }

  getComplain() {
    return this.httpClient.get(`${ENV}/complaint`);
  }

  getProfile(id) {
    return this.httpClient.get(`${ENV}/profile/${id}`);
  }

  getUser(id) {
    return this.httpClient.get(`${ENV}/user/${id}`)
  }

  updateUser(form) {
    return this.httpClient.put(`${ENV}/user/update/${form._id}`, form)
  }

  declineComplaint(form) {
    return this.httpClient.post(`${ENV}/complaint/decline`, form)
  }

  updateComplaint(form) {
    return this.httpClient.put(`${ENV}/complaint/${form._id}`, form)
  }

  getConselorByCategory(id) {
    return this.httpClient.get(`${ENV}/specialist/conselor/${id}`)
  }
}
