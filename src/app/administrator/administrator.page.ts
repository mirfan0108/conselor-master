import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { AdminServiceService } from './admin-service.service';
import { ModalController } from '@ionic/angular';
import { DetailComplaintPage } from './detail-complaint/detail-complaint.page';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CategoryServiceService } from '../services/category-service.service';
const ENV = environment.apiUrl;

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.page.html',
  styleUrls: ['./administrator.page.scss'],
})
export class AdministratorPage implements OnInit {

  constructor(private api: AdminServiceService, private modalCtrl: ModalController,
    private socket: Socket, private router: Router, private apiCategory: CategoryServiceService) { }
  @Input() categories = [];
  complaintApp = []
  approved = []
  stayed = []
  ngOnInit() {
    let profile;
    this.complaintApp = [];
    this.api.getComplain()
    .subscribe((res: any) => {
      this.apiCategory.getCategories().subscribe((res: any) => {
        this.categories = res.data
      })
      res.data.forEach(element => {
          this.api.getProfile(element.patientId)
          .subscribe((profile: any) => {
            // console.log(profile)
            element.profile = profile.data[0];
            element.profile.avatar = ENV+"/media/"+profile.data[0]._id
            element.profile.ktp = ENV+"/media/ktp/"+profile.data[0]._id
          })
          this.complaintApp.push(element)
      });
      console.log(this.complaintApp)
      this.complaintApp.forEach(complaint => {
        if(complaint.status == 9) {
          this.api.getProfile(complaint.conselorId)
          .subscribe((profile: any) => {
            // console.log(profile)
            complaint.conselor_profile = profile.data[0];
            complaint.conselor_profile.avatar = ENV+"/media/"+profile.data[0]._id
          })
          this.approved.push(complaint)
        } else {
          this.stayed.push(complaint)
        }
      })
      this.getUpdate()
        .subscribe(update => {
          this.updateData()
        })
    })
    
  }

  updateData(){
    this.complaintApp = [];
    this.api.getComplain()
    .subscribe((res: any) => {
      res.data.forEach(element => {
          this.api.getProfile(element.patientId)
          .subscribe((profile: any) => {
            // console.log(profile)
            element.profile = profile.data[0];
            element.profile.avatar = ENV+"/media/"+profile.data[0]._id
            element.profile.ktp = ENV+"/media/ktp/"+profile.data[0]._id
          })
          this.complaintApp.push(element)
      });
      console.log(this.complaintApp)
    })
  } 
  async openDetail(data) {
    const modal = await this.modalCtrl.create({
      component: DetailComplaintPage,
      componentProps: {
        dataComplaint: data
      }
    });
    return await modal.present();
  }

  getUpdate(){
    let observable = new Observable(obs => {
      this.socket.on('patient-status-changed', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  doLogout() {
    this.router.navigateByUrl('logout')
  }
  getText(id) {
    let text;
    // console.log(this.categories)
    this.categories.forEach(category => {
      if(category._id == id) {
        text = category.category
      }
    })
    return text;
  }

  normalizeDate(dateChip) {
    let date = dateChip
    let dateChiper = date.split("T")
    let dateArr = dateChiper[0].split("-");
    let dateText;
    switch (dateArr[1]) {
      case "01":
        dateText = dateArr[2]+" Januari "+dateArr[0]
        break;
      case "02":
        dateText = dateArr[2]+" Februari "+dateArr[0]
        break;
      case "03":
        dateText = dateArr[2]+" Maret "+dateArr[0]
        break;
      case "04":
        dateText = dateArr[2]+" April "+dateArr[0]
        break;
      case "05":
        dateText = dateArr[2]+" Mei "+dateArr[0]
        break;
      case "06":
        dateText = dateArr[2]+" Juni "+dateArr[0]
        break;
      case "07":
        dateText = dateArr[2]+" Juli "+dateArr[0]
        break;
      case "08":
        dateText = dateArr[2]+" Agustus "+dateArr[0]
        break;
      case "09":
        dateText = dateArr[2]+" September "+dateArr[0]
        break;
      case "10":
        dateText = dateArr[2]+" Oktober "+dateArr[0]
        break;
      case "11":
        dateText = dateArr[2]+" November "+dateArr[0]
        break;
      case "12":
        dateText = dateArr[2]+" Desember "+dateArr[0]
        break;
      default:
        break;
    }
    return dateText
  }

  normalizeTime(dateChip) {
    let date = dateChip
    let dateChiper = date.split("T")
    let dateArr = dateChiper[1].split(":");
    let dateText = dateArr[0]+":"+dateArr[1];
    return dateText
  }
}
