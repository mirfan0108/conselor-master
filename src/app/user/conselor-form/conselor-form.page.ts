import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conselor-form',
  templateUrl: './conselor-form.page.html',
  styleUrls: ['./conselor-form.page.scss'],
})
export class ConselorFormPage implements OnInit {
  @Input() categories: any;
  role = 1;
  constructor(private modalCtrl: ModalController) { }
  
  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  saveData() {
    console.log(this.categories)
    const check = this.categories.findIndex(_item => _item.checked === true)
    if(check > -1) {
      this.modalCtrl.dismiss({categories: this.categories, role: this.role})
    } else {
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: "Anda Belum memilih jenis kekerasan yang akan anda tangani"
      })
    }
  }
  

}
