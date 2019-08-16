import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ScheduleServicesService } from '../schedule-services.service';

@Component({
  selector: 'app-set-schedule',
  templateUrl: './set-schedule.page.html',
  styleUrls: ['./set-schedule.page.scss'],
})
export class SetSchedulePage implements OnInit {
  @Input() dates: any = [];
  @Input() isPost: true;
  formDate = {
    conselor_id: "",
    date: "",
    time: []
  }
  clock = [
    { time: "09:00", status: 0 },
    { time: "10:00", status: 0 },
    { time: "11:00", status: 0 },
    { time: "12:00", status: 0 },
    { time: "13:00", status: 0 },
    { time: "14:00", status: 0 },
    { time: "15:00", status: 0 },
    { time: "16:00", status: 0 },
    { time: "17:00", status: 0 },
    { time: "18:00", status: 0 },
    { time: "19:00", status: 0 },
    { time: "20:00", status: 0 },
    { time: "21:00", status: 0 },
    { time: "22:00", status: 0 }
  ]
  selectedDate = "";
  times = [];
  timeChanged = false;
  constructor(private modalCtrl: ModalController, private api: ScheduleServicesService) { }

  ngOnInit() {
    this.formDate.conselor_id = JSON.parse(localStorage.getItem("_USER"))._ID
    console.log(this.dates)
    let nowDate = new Date()
    this.selectedDate = nowDate.getFullYear()+"-"+this.pad(nowDate.getMonth()+1, 2)+"-"+this.pad(nowDate.getDate(), 2)
    this.formDate.time = this.clock;
    this.selectDate()
  }
  closeModal() {
    this.modalCtrl.dismiss()
  }

  doSubmit() {
    console.log(this.clock)
  }

  doSave() {
    console.log(this.dates)
    const i = this.dates.findIndex(date => date.date == this.formDate.date);
    let form;
    if(i > -1 ){
      console.log("exist")
      this.dates.forEach(date => {
        if(date.date == this.formDate.date) {
          form = {
            _id: date._id,
            date: this.formDate.date,
            time: this.formDate.time,
            conselor_id: this.formDate.conselor_id
          }
        }
      });
      this.api.updateMySchedule(form)
      .subscribe((resp: any) => {
        this.modalCtrl.dismiss()
      })
    } else {
      this.api.setSchedule(this.formDate)
      .subscribe((resp: any) => {
        console.log(resp);
        this.dates.push(resp.data)
        this.modalCtrl.dismiss()
      })
      console.log("not exist")
    }
  }

  selectDate() {
    if(!this.timeChanged) {
      console.log(this.clock)
      if(this.dates.length > 0) {
        this.formDate.date = this.selectedDate
        const i = this.dates.findIndex(date => date.date == this.selectedDate)
        if(i > -1) {
          this.dates.forEach(date => {
            if(date.date == this.selectedDate) {
              this.formDate.date = date.date
              this.formDate.time = date.time
            }
        });
        } else {
          this.formDate.time = [
            { time: "09:00", status: 0 },
            { time: "10:00", status: 0 },
            { time: "11:00", status: 0 },
            { time: "12:00", status: 0 },
            { time: "13:00", status: 0 },
            { time: "14:00", status: 0 },
            { time: "15:00", status: 0 },
            { time: "16:00", status: 0 },
            { time: "17:00", status: 0 },
            { time: "18:00", status: 0 },
            { time: "19:00", status: 0 },
            { time: "20:00", status: 0 },
            { time: "21:00", status: 0 },
            { time: "22:00", status: 0 }
          ]
          this.formDate.date = this.selectedDate
        }
        
      } else {
        this.formDate.time = [
          { time: "09:00", status: 0 },
          { time: "10:00", status: 0 },
          { time: "11:00", status: 0 },
          { time: "12:00", status: 0 },
          { time: "13:00", status: 0 },
          { time: "14:00", status: 0 },
          { time: "15:00", status: 0 },
          { time: "16:00", status: 0 },
          { time: "17:00", status: 0 },
          { time: "18:00", status: 0 },
          { time: "19:00", status: 0 },
          { time: "20:00", status: 0 },
          { time: "21:00", status: 0 },
          { time: "22:00", status: 0 }
        ]
        this.formDate.date = this.selectedDate
      } 
    } else {
        Swal.fire({
          title: 'Anda Yakin ?',
          text: "Anda Sudah merubah Jam Pada tanggal ini , data tersebut tidak tersimpan!",
          type: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ganti Tanpa Menyimpan'
        }).then((result) => {
          console.log(result)
          if (result.value) {
            this.timeChanged = false;
            this.formDate.date = this.selectedDate;
            this.formDate.time = []
            this.selectDate();
            // console.log(this.clock)
          }
        })
    }
  }

  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  checkTime(time) {

  }

  getScheduler() {

  }

}
