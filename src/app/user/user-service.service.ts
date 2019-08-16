import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private  httpClient:  HttpClient) { }

  register(newUser: any) {
    console.log(newUser)
    let form = new FormData();
    if(newUser.avatar) {
      form.append("avatar", newUser.avatar, newUser.avatar.name);
    }
    form.append("email", newUser.email);
    form.append("role", newUser.role);
    form.append("password", newUser.password);
    form.append("name", newUser.name);
    form.append("hp", newUser.hp);
    form.append("gender", newUser.gender);
    form.append("birth", newUser.birth);
    form.append("address", newUser.address);
    
    return this.httpClient.post(`${ENV}/regist`, form);
  }

  login(user: any) {
    return this.httpClient.post(`${ENV}/login`, user)
  }

  getUser(id) {
    return this.httpClient.get(`${ENV}/user/`+id)
  }

  async logout() {
    localStorage.clear()
  }

  sendEmail(form) {
    return this.httpClient.post(`${ENV}/forget-password/send-email`, form)
  }

  updateUser(form) {
    return this.httpClient.put(`${ENV}/user/update/`+form._id, form)
  }

  updateProfile(profile: any) {
    return this.httpClient.put(`${ENV}/profile/${profile._id}`, profile)
  }

  addSpecialist(req) {
    return this.httpClient.post(`${ENV}/specialist`, req)
  }

  getConselorBySpecialist(id) {
    return this.httpClient.get(`${ENV}/specialist/conselor/${id}`)
  }

  postWeekly(req) {
    return this.httpClient.post(`${ENV}/schedule/weekly`, req)
  }
  putWeekly(req) {
    let week = {
      week: req.week
    }
    return this.httpClient.put(`${ENV}/schedule/weekly/${req._id}`, week)
  }
  getWeekly(id) {
    return this.httpClient.get(`${ENV}/schedule/weekly/${id}`)
  }
  getProfile(id) {
    return this.httpClient.get(`${ENV}/profile/${id}`);
  }
}
