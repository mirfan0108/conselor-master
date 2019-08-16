import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ConselingScheduleService } from 'src/app/services/conseling-schedule.service';
import { UserServiceService } from 'src/app/user/user-service.service';
import { environment } from 'src/environments/environment'
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
const MEDIA = environment.imageUrl;
@Component({
  selector: 'app-room-chat',
  templateUrl: './room-chat.page.html',
  styleUrls: ['./room-chat.page.scss'],
})
export class RoomChatPage implements OnInit {
  @ViewChild('IonContent') content: IonContent
  @Input() dataConseling: any
  @Input() status: any
  paramData: any;
  msgList: any = [];
  userName: any;
  user_input: string = "";
  User: string;
  toUser: string;
  start_typing: any;
  loader: boolean;
  profile: any;
  constructor(public activRoute: ActivatedRoute, private modalCtrl: ModalController, 
    private apiConseling: ConselingScheduleService, private apiUser: UserServiceService,
    private socket: Socket) {}

  ngOnInit() {
    console.log(this.dataConseling)
    this.toUser = this.dataConseling.patientId
    this.User = this.dataConseling.conselorId
    this.apiUser.getProfile(this.dataConseling.conselorId)
    .subscribe((respProfile: any) => {
      if(respProfile.data[0].avatar == "" || respProfile.data[0].avatar.data == null) {
        if(respProfile.data[0].gender == "men") {
          respProfile.data[0].avatar = "../../assets/images/men.jpg"
        } else {
          respProfile.data[0].avatar = "../../assets/images/women.jpg"
        }
      } else {
        respProfile.data[0].avatar = MEDIA+"/media/"+respProfile.data[0]._id;
      }
      this.profile = respProfile.data[0]
      this.fetchData()
    })
    this.getMessages()
    .subscribe((dataObs: any) => {
      this.msgList = []
      this.fetchData()
    })
  }

  startVidCall(id) {
    this.modalCtrl.dismiss({state: "makeVidCall", to: id})
    console.log(id)
  }

  startCall(id) {
    this.modalCtrl.dismiss({state: "makeCall", to: id})
    console.log(id)
  }


  sendMsg() {
    let time = new Date()
    let tempTime = this.pad(time.getHours(),2)+":"+this.pad(time.getMinutes(),2)
    let formMsg = {
      complaint_id: this.dataConseling._id,
      user_id: this.dataConseling.patientId,
      avatar: this.profile.avatar,
      name: this.dataConseling.patient.name,
      text: this.user_input,
      time: tempTime
    }
    if (this.user_input !== '') {
      this.apiConseling.sendChat(formMsg)
      .subscribe((resp: any) => {
        console.log(resp)
        this.socket.emit('add-message', 
        {
          data: {
            userId: this.User,
            userName: this.profile.name,
            userAvatar: this.profile.avatar,
            time: tempTime,
            message: resp.data.text,
            id: this.dataConseling._id
          }
        })
      })
      this.user_input = "";
      this.scrollDown()
      setTimeout(() => {
        // this.senderSends()
      }, 500);
    }
  }

  getMessages() {
    let observable = new Observable(obs => {
      this.socket.on('message', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  senderSends() {
    this.loader = true;
    setTimeout(() => {
      this.msgList.push({
        userId: this.User,
        userName: this.User,
        userAvatar: "../../assets/chat/chat5.jpg",
        time: "12:01",
        message: "Sorry, didn't get what you said. Can you repeat that please"
      });
      this.loader = false;
      this.scrollDown()
    }, 2000)
    this.scrollDown()
  }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 50);
  }

  userTyping(event: any) {
    console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown()
  }
  checkUser(id) {
    const i = this.apiConseling.activeId.findIndex(item => item === id);
    if(i > -1){
      return true;
    } else {
      return false;
    }
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  fetchData() {
    this.apiConseling.getChat(this.dataConseling._id)
    .subscribe((res: any) => {
      let temp;
      if(res.data.length > 0) {
        res.data.forEach(element => {
          temp = {
            userId: element.user_id,
            userName: element.name,
            userAvatar: element.avatar,
            time: element.time,
            message: element.text,
            id: element.complaint_id
          }
          this.msgList.push(temp)
        });
      }
    })
  }
  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
