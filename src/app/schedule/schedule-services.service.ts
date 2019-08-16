import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ScheduleServicesService {

  constructor(private  httpClient:  HttpClient) { }
  getMySchedule(id) {
    return this.httpClient.get(`${ENV}/new/schedule/${id}`);
  }

  getMyScheduleDate(form) {
    return this.httpClient.get(`${ENV}/new/schedule/${form.id}/dates/${form.date}`, );
  }

  setSchedule(req) {
    return this.httpClient.post(`${ENV}/new/schedule`, req);
  }

  updateMySchedule(req) {
    return this.httpClient.put(`${ENV}/new/schedule/${req._id}`, req);
  }

}
