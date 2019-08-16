import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CategoriesResponse } from 'src/app/_types/categories-response';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { NoteComplaintPage } from '../note-complaint/note-complaint.page';
import { ConselorSelectionPage } from '../conselor-selection/conselor-selection.page';
import { AdminServiceService } from '../admin-service.service';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-detail-complaint',
  templateUrl: './detail-complaint.page.html',
  styleUrls: ['./detail-complaint.page.scss'],
})
export class DetailComplaintPage implements OnInit {
  @Input() dataComplaint: any;
  categories = [];
  profileValid = false;
  applicationValid = false;
  constructor(private modalCtrl: ModalController, private apiCategory: CategoryServiceService,
    private api: AdminServiceService, private socket: Socket) { }

  ngOnInit() {
    console.log(this.dataComplaint)
    this.apiCategory.getCategories()
    .subscribe((res: any) => {
      console.log(res)
      res.data.forEach((category: any) => {
        if(category._id == this.dataComplaint.category_id) {
          this.dataComplaint.text_category = category.category
        }
      });
    })
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  async openNote(){
    this.modalCtrl.dismiss()
    if(!this.profileValid) {
      this.dataComplaint.status = 1
    } else if(!this.applicationValid) {
      this.dataComplaint.status = 2
    } else if(!this.applicationValid && !this.profileValid) {
      this.dataComplaint.status = 3
    }

    const modal = await this.modalCtrl.create({
      component: NoteComplaintPage,
      componentProps: {
        dataComplaint: this.dataComplaint
      }
    });
    modal.onDidDismiss().then((res: any) => {
      console.log(res)
      
    })
    return await modal.present();
  }

  normalizeDate(data) {
    let date = data
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
    return dateText;
  }

  async selectConselor() {
    this.modalCtrl.dismiss()
    const modal = await this.modalCtrl.create({
      component: ConselorSelectionPage,
      componentProps: {
        category_id: this.dataComplaint.category_id
      }
    });
    modal.onDidDismiss().then((res: any) => {
      console.log(res)
      let formUpdate;
      if(res.role == "false") {
        
      } else if(res.role == "true") {
        this.dataComplaint.conselorId = res.data.conselor_id
        formUpdate = {
          category_id: this.dataComplaint.category_id,
          conselorId: this.dataComplaint.conselorId,
          created_on: this.dataComplaint.created_on,
          note: this.dataComplaint.note,
          patientId: this.dataComplaint.patientId,
          status: 9,
          story: this.dataComplaint.story,
          subyek: this.dataComplaint.subyek,
          __v: 0,
          _id: this.dataComplaint._id,
        }
        this.api.updateComplaint(formUpdate).subscribe(async (comp:any) => {
          console.log(comp)
          let status = {
            status: 9,
            user_id: this.dataComplaint.patientId
          }
          this.socket.emit('status-update', status)
        })
      }
      console.log(this.dataComplaint)
      
    })
    return await modal.present();
  }
}
