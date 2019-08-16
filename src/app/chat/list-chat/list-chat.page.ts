import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RoomChatPage } from '../room-chat/room-chat.page';
import { ConselingScheduleService } from 'src/app/services/conseling-schedule.service';
import { CallerPage } from '../caller/caller.page';
import { VidcallPage } from '../vidcall/vidcall.page';

@Component({
  selector: 'app-list-chat',
  templateUrl: './list-chat.page.html',
  styleUrls: ['./list-chat.page.scss'],
})
export class ListChatPage implements OnInit {
  @Input() listConseling: any
  @Input() peer: any
  constructor(private socket: Socket, private modalCtrl: ModalController, private apiConseling: ConselingScheduleService) { }
  ngOnInit() {
    console.log(this.peer)
    console.log(this.listConseling)
    
  }

  getActiveUser() {
    let observable = new Observable(obs => {
      this.socket.on('users-changed', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  async openChatRoom(data) {
    console.log(data)
    let status = 0
    if(this.checkUser(data.patientId)) {
      status = 1
    } 
    const modal = await this.modalCtrl.create({
      component: RoomChatPage,
      componentProps: {
        dataConseling: data,
        status: status
      }
    });

    modal.onDidDismiss().then((res: any) => {
      // this.segmentValue = "schedule";
      if(res.data) {
        switch (res.data.state) {
          case "makeCall":
            this.makeCall(res.data.to)
            break;
          case "makeVidCall":
            this.makeVidCall(res.data.to)
            break;
        
          default:
            break;
        }
      }
    })
    return await modal.present();
  }

  async makeCall(id) {
    let storeLocal = localStorage.getItem('_USER');
    let mine = JSON.parse(storeLocal)._ID
    const modal = await this.modalCtrl.create({
      component: CallerPage,
      componentProps: {
        from: mine,
        to: id,
        peer: this.peer,
        ongoing: false
      }
    });
    modal.onDidDismiss().then((res: any) => {
      
    })
    return await modal.present();
  }

  async makeVidCall(id) {
    let storeLocal = localStorage.getItem('_USER');
    let mine = JSON.parse(storeLocal)._ID
    const modal = await this.modalCtrl.create({
      component: VidcallPage,
      componentProps: {
        from: mine,
        to: id,
        peer: this.peer,
        ongoing: false
      }
    });
    modal.onDidDismiss().then((res: any) => {
      
    })
    return await modal.present();
  }

  checkUser(id) {
    const i = this.apiConseling.activeId.findIndex(item => item === id);
    if(i > -1){
      return true;
    } else {
      return false;
    }
  }
}
