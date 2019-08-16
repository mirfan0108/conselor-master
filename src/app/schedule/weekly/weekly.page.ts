import { Component, OnInit, Input } from '@angular/core';
import { UserServiceService } from 'src/app/user/user-service.service';
import { CalendarComponentOptions } from 'ion2-calendar'
import { ModalController } from '@ionic/angular';
import { SetSchedulePage } from '../set-schedule/set-schedule.page';
import { ScheduleServicesService } from '../schedule-services.service';
@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.page.html',
  styleUrls: ['./weekly.page.scss'],
})
export class WeeklyPage implements OnInit {
  @Input() weekly: any;
  @Input() weekId: string;
  isChanged = false;
  optionsCalendar: CalendarComponentOptions = {
    showMonthPicker: false,
    weekdays: ['minggu','senin','selasa','rabu','kamis','jumat','sabtu'],
    monthFormat: 'MMMM YYYY',
  };

  dates = [];
  times = [];
  selectedDate = "";
  firstTime = true;
  text_null = "Silahkan pilih Edit Jadwal Untuk menambahkan jadwal Anda"
  constructor(private api: UserServiceService, private modalCtrl: ModalController, private apiSchedule: ScheduleServicesService) { }

  ngOnInit() {
    if(localStorage.getItem('_firstTime') == "true") {
      this.firstTime = true;
      localStorage.removeItem('_firstTime')
      localStorage.setItem('_firstTime', "false")
    } else {
      this.firstTime = false;
    }
    this.times = [];
    let nowDate = new Date();
    this.selectedDate = nowDate.getFullYear()+"-"+this.pad(nowDate.getMonth()+1, 2)+"-"+this.pad(nowDate.getDate(), 2)
    let id = JSON.parse(localStorage.getItem("_USER"))._ID
    this.apiSchedule.getMySchedule(id)
    .subscribe((res: any) => {
      console.log(res)
      this.dates = res.data
      this.dates.forEach(element => {
        if(element.date == this.selectedDate) {
          element.time.forEach(time => {
            time.status != 0 ? this.times.push(time) : '';
          });
        }
      });
    })
    
  }

  doSubmit() {
    let id = JSON.parse(localStorage.getItem("_USER"))._ID
    let form = {
      week: this.weekly,
      _id: id
    }
    this.api.putWeekly(form).subscribe(res => console.log(res))
    this.isChanged = false
  }

  doChange() {
    this.isChanged = true;
  }

  selectDate() {
    this.times = [];
    this.dates.forEach(element => {
      if(element.date == this.selectedDate) {
        element.time.forEach(time => {
          time.status != 0 ? this.times.push(time) : '';
        });
      }
    });
  }

  fetchData() {
    this.times = [];
    let nowDate = new Date();
    this.selectedDate = nowDate.getFullYear()+"-"+this.pad(nowDate.getMonth()+1, 2)+"-"+this.pad(nowDate.getDate(), 2)
    let id = JSON.parse(localStorage.getItem("_USER"))._ID
    this.apiSchedule.getMySchedule(id)
    .subscribe((res: any) => {
      console.log(res)
      this.dates = res.data
      this.dates.forEach(element => {
        if(element.date == this.selectedDate) {
          element.time.forEach(time => {
            time.status != 0 ? this.times.push(time) : '';
          });
        }
      });
    })
  }
  async setSchedule() {
    const modal = await this.modalCtrl.create({
      component: SetSchedulePage,
      componentProps: {
        dates: this.dates
      }
    });
    modal.onDidDismiss().then(() => {
      this.fetchData()
    })
    return await modal.present();
  }
  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

}
