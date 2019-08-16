import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConselingScheduleService } from 'src/app/services/conseling-schedule.service';

@Component({
  selector: 'app-conseling-result',
  templateUrl: './conseling-result.page.html',
  styleUrls: ['./conseling-result.page.scss'],
})
export class ConselingResultPage implements OnInit {
  @Input() dataConseling: any;
  @Input() category: any;
  constructor(private modalCtrl: ModalController, private api: ConselingScheduleService) { }

  ngOnInit() {
    console.log(this.dataConseling)
    
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }
  putConseling(){
    let form = {
      status: 9,
      complaint_id: this.dataConseling.complaint_id,
      methode: this.dataConseling.methode,
      option: this.dataConseling.option,
      result: this.dataConseling.result,
      patientId: this.dataConseling.patientId,
      conselorId: this.dataConseling.conselorId,
      created_on: this.dataConseling.created_on,
      _id: this.dataConseling._id
    }
    this.api.setResult(form)
    .subscribe((resp: any) => {
      console.log(resp)
      this.api.getMyScheduleConseling(this.dataConseling._id)
      .subscribe((respSchedule: any) => {
        let form = respSchedule.data[0];
        form.status = 9
        this.api.updateStatusSchedule(form).subscribe((respRest: any) => {
          console.log(respRest)
          this.modalCtrl.dismiss(this.dataConseling)
        })
      })
    })
    console.log()
  }

}
