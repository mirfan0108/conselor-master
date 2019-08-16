import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdminServiceService } from '../admin-service.service';
import { environment } from 'src/environments/environment'
const ENV = environment.apiUrl;
@Component({
  selector: 'app-conselor-selection',
  templateUrl: './conselor-selection.page.html',
  styleUrls: ['./conselor-selection.page.scss'],
})
export class ConselorSelectionPage implements OnInit {

  @Input() category_id: string;
  conselors = []
  constructor(private modalCtrl: ModalController, private api: AdminServiceService) { }

  ngOnInit() {
    this.api.getConselorByCategory(this.category_id).subscribe((res: any) => {
        res.data.forEach(conselor => {
          this.api.getProfile(conselor.conselor_id)
          .subscribe((profile: any) => {
            console.log(profile.data[0])
            conselor.profile = profile.data[0];
            conselor.profile.avatar = ENV+"/media/"+profile.data[0]._id
            conselor.profile.ktp = ENV+"/media/ktp/"+profile.data[0]._id
          })
          this.conselors.push(conselor)
        });
      console.log(this.conselors)
    })
  }

  closeModal() {
    this.modalCtrl.dismiss(false, "false")
  }

  selected(conselor) {
    console.log(conselor)
    this.modalCtrl.dismiss(conselor, "true")
  }
}
