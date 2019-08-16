import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConselingResultPage } from '../conseling-result/conseling-result.page';

@Component({
  selector: 'app-list-conseling',
  templateUrl: './list-conseling.page.html',
  styleUrls: ['./list-conseling.page.scss'],
})
export class ListConselingPage implements OnInit {
  @Input() listConseling: any;
  @Input() categories: any;
  groupDate = [];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.listConseling)
    console.log(this.categories)
  }

  getCategory(id) {
    let category;
    this.categories.forEach(element => {
      if(element._id == id) {
        category = element.category
      }
    });
    return category;  
  }

  async openResult(data) {
    console.log(data)
    const modal = await this.modalCtrl.create({
      component: ConselingResultPage,
      componentProps: {
        dataConseling: data,
        category: this.getCategory(data.complaint_data.category_id)
      }
    });
    modal.onDidDismiss().then((res: any) => {
      if(res.data) {
        data = res.data
      }
    })
    return await modal.present();
  }

}
