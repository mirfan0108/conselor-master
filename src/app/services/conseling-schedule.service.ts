import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ConselingScheduleService {
  activeId = []
  constructor(private  httpClient:  HttpClient) { }

  getMyScheduleConseling(id) {
    return this.httpClient.get(`${ENV}/schedule/conselings/${id}`);
  }
  getMyConseling(id) {
    return this.httpClient.get(`${ENV}/conseling/${id}`);
  }
  getComplaintId(id){
    return this.httpClient.get(`${ENV}/complaint/id/${id}`);
  }

  getComplaintConselor(id) {
    return this.httpClient.get(`${ENV}/complaint/conselor/${id}`);
  }
  getChat(id) {
    return this.httpClient.get(`${ENV}/log/chat/${id}`);
  }
  sendChat(req) {
    return this.httpClient.post(`${ENV}/log/chat`, req)
  }

  setResult(req) {
    return this.httpClient.put(`${ENV}/conseling/${req._id}`, req)
  }

  updateStatusSchedule(req) {
    return this.httpClient.put(`${ENV}/schedule/${req.conseling_id}`, req);
    
  }

  
}

