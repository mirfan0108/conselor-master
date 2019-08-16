import { Component, OnInit, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { AdminServiceService } from '../admin-service.service';
import { Socket } from 'ng-socket-io';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-note-complaint',
  templateUrl: './note-complaint.page.html',
  styleUrls: ['./note-complaint.page.scss'],
})
export class NoteComplaintPage implements OnInit {
  @Input() dataComplaint: any;
  @Output() result: any;
  categories = [];
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

  sendNote(){
    let timerInterval;
    Swal.fire({
      title: '<strong>Mohon Tunggu</strong>',
      text: 'Sedang dalam proses ',
      timer: 3000,
      onBeforeOpen: () => {
        // this.doLogin()
        Swal.showLoading();
        timerInterval = setInterval(() => {
        }, 3000)
      },
      onOpen: async () => {
        Swal.stopTimer();
        let status = this.dataComplaint.status;
        this.dataComplaint.status = 1;
        this.api.getUser(this.dataComplaint.patientId)
        .subscribe((res: any) => {
          console.log(res)
          res.status = status;
          this.api.updateUser(res).subscribe((newData: any) => {
            console.log(newData)
            let formDecline = {
              email: res.email,
              note: {
                complaint_id: this.dataComplaint._id,
                note: this.dataComplaint.note
              }
            }
            let formUpdateComplaint = {
              category_id: this.dataComplaint.category_id,
              conselorId: "",
              created_on: this.dataComplaint.created_on,
              note: this.dataComplaint.note,
              patientId: this.dataComplaint.patientId,
              status: 1,
              story: this.dataComplaint.story,
              subyek: this.dataComplaint.subyek,
              __v: 0,
              _id: this.dataComplaint._id,
            }
            this.api.declineComplaint(formDecline)
            .subscribe(async (resp: any) => {
              console.log(resp)
              let status1 = {
                status: res.status,
                user_id: res._id
              }
              if(resp.code == 200) {
                await this.socket.emit('status-update', status1)
              }
              await this.api.updateComplaint(formUpdateComplaint)
                .subscribe(updateComplaint => updateComplaint)
            })
          })
        })
        Swal.resumeTimer();
      },
      onClose: () => {
        clearInterval(timerInterval)
        this.modalCtrl.dismiss(true)
      },
    })
    
  }

  closeModal() {
    // this.result = false;
    this.modalCtrl.dismiss(false)
  }
}
