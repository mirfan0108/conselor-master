import { Component, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ListChatDirective } from '../directives/list-chat.directive';
import { ModalController } from '@ionic/angular';
import { ListChatPage } from '../chat/list-chat/list-chat.page';
import { ListConselingDirective } from '../directives/list-conseling.directive';
import { ListConselingPage } from '../conseling/list-conseling/list-conseling.page';
import { WeeklyDirective } from '../directives/weekly.directive';
import { WeeklyPage } from '../schedule/weekly/weekly.page';
import { UserServiceService } from '../user/user-service.service';
import { ConselingScheduleService } from '../services/conseling-schedule.service';
import { environment } from 'src/environments/environment'
import { CategoryServiceService } from '../services/category-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { AdministratorDirective } from '../directives/administrator.directive';
import { AdministratorPage } from '../administrator/administrator.page';
import { AdminServiceService } from '../administrator/admin-service.service';
import { ReceiveCallPage } from '../chat/receive-call/receive-call.page';
import { CallerPage } from '../chat/caller/caller.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { VidcallPage } from '../chat/vidcall/vidcall.page';
const MEDIA = environment.imageUrl;
declare var Peer: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(ListChatDirective) listChatDirective: ListChatDirective;
  @ViewChild(ListConselingDirective) listConselingDirective: ListConselingDirective;
  @ViewChild(WeeklyDirective) weeklyDirective: WeeklyDirective;
  @ViewChild(AdministratorDirective) administratorDirective: AdministratorDirective;

  segmentValue = "schedule"
  weeks = [];
  complaintTotal = 0;
  conselingData = []
  categories: any;
  role = 1;

  peer: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private api: UserServiceService,
    private viewContainerRef: ViewContainerRef, private modalCtrl: ModalController, private router: Router,
    private activatedRoute: ActivatedRoute,
    private socket: Socket, private adminApi: AdminServiceService, private androidPermissions: AndroidPermissions,
    private apiConseling: ConselingScheduleService, private apiCategory: CategoryServiceService) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
    }
  ngOnInit() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.peer = new Peer(id)
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });
    this.peer.on("connection", (conn) => {
      conn.on("call", (data) => {
        console.log("call")
      })
    })
    // this.receiveCall()
    this.incomingCall().subscribe((userData: any) => {
      if(userData.user.data.to == id) {
        this.openReceiveCall(userData.user.data)
      }
    })

    this.incomingVidCall().subscribe((userData: any) => {
      console.log("Vidcallan")
      if(userData.user.data.to == id) {
        this.openVidCallInComing(userData.user.data)
        // this.openReceiveCall(userData.user.data)
      }
    })
    this.getOngoing().subscribe((user: any) => {
      console.log(user.user.data)
      if(user.user.data.to == id || user.user.data.from == id) {
        this.openCaller(user.user.data)
      }
    })
    this.incomingVidCall().subscribe(userData => {
      console.log(userData)
    })
    this.role = JSON.parse(storeLocal).role
    this.statusActive()
    this.apiCategory.getCategories()
      .subscribe((categories: any) => {
        this.categories = categories.data
        this.apiConseling.getMyConseling(id)
        .subscribe((res: any) => {
          res.data.forEach(conseling => {
            this.apiConseling.getComplaintId(conseling.complaint_id)
            .subscribe((respComplaint: any) => {
              conseling.complaint_data = respComplaint.data
            })
            this.apiConseling.getMyScheduleConseling(conseling._id)
            .subscribe((respSchedule: any) => {
              conseling.schedule = respSchedule.data[0];
            })
            this.api.getProfile(conseling.patientId)
            .subscribe((respUser: any) => {
              if(respUser.data[0].avatar == "" || respUser.data[0].avatar.data == null) {
                if(respUser.data[0].gender == "men") {
                  respUser.data[0].avatar = "../../assets/images/men.jpg"
                } else {
                  respUser.data[0].avatar = "../../assets/images/women.jpg"
                }
              } else {
                respUser.data[0].avatar = MEDIA+"/media/"+respUser.data[0]._id;
              }
              conseling.patient = respUser.data[0]
            })
            this.conselingData.push(conseling)
          });
          if(this.segmentValue == 'schedule') {
            this.api.getWeekly(id).subscribe((res: any) => {
              console.log(res)
              this.loadWeekly(res.data[0])
            })
          }
        })
        if(this.role == 9) {
          this.adminApi.getComplain()
          .subscribe((res: any) => {
            res.data.forEach(element => {
              if(element.status != 9) {
                this.complaintTotal ++;
              }
            });
          })
        }
        if(this.activatedRoute.snapshot.paramMap.get('slug') == "chat") {
          this.controlConseling('chat');
          // this.segmentValue = 'chat'
          // this.chatRoom('tes');
        }
      })
      this.getActiveUser().subscribe((dataObs: any) => {
        if(dataObs.event == 'joined') {
          const i = this.apiConseling.activeId.findIndex(item => item === dataObs.user);
          if(i > -1){
  
          } else {
            this.apiConseling.activeId.push(dataObs.user)
          }
        } else {
          const i = this.apiConseling.activeId.findIndex(item => item === dataObs.user);
          if(i > -1){
            this.apiConseling.activeId.splice(i, 1)
          } else {
            // this.activeId.push(dataObs.user)
          }
        }
      })
      
    
  }

  resultCall= false;

  incomingCall() {
    let observable = new Observable(obs => {
      this.socket.on('call-connecting', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  incomingVidCall() {
    let observable = new Observable(obs => {
      this.socket.on('vidcall-connecting', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  receiveCall() {
    var getUserMedia = navigator.getUserMedia ;
    this.peer.on('call', (call: any) => {
      getUserMedia({video: false, audio: true}, (stream: any) => {
        call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream: any) => {
            // Show stream in some video/canvas element.
            // this.openCaller()
          });
          call.on("close", () => {
            console.log("by")
          })
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });   
    });
  

  }

  async openReceiveCall(user) {
    console.log(user)
    const modal = await this.modalCtrl.create({
      component: ReceiveCallPage,
      componentProps: {
        from: user.from,
        to: user.to
      }
    });
    modal.onDidDismiss().then(res => {
      console.log(res.data)
      
      switch (res.data.state) {
        case "answare":
          this.socket.emit('start-call', 
              {
                data: {
                  to: res.data.to,
                  from: res.data.from
                }
              })
          
          break;
        case "close":
          this.socket.emit('end-call', 
              {
                data: {
                  to: res.data.to,
                  from: res.data.from
                }
              })
          break;
        default:
          break;
      }
      
      
    })
    return await modal.present();
  }

  async openVidCallInComing(user) {
    console.log(user)
    const modal = await this.modalCtrl.create({
      component: VidcallPage,
      componentProps: {
        from: user.from,
        to: user.to,
        peer: this.peer,
        incomingCall: true,
        ongoing: true
      }
    });
    return await modal.present();
  }
  getOngoing() {
    let observable = new Observable(obs => {
      this.socket.on('call-connect', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  async openCaller(user) {
    const modal = await this.modalCtrl.create({
      component: CallerPage,
      componentProps: {
        peer: this.peer,
        ongoing: true,
        from: user.from,
        to: user.to
      }
    });

    return await modal.present();
  }

  segmentChanged($event) {
    this.conselingData = []
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.segmentValue = $event.detail.value;
    if($event.detail.value == 'chat'){
      this.apiConseling.getComplaintConselor(id)
      .subscribe((respComplaint: any) => {
        console.log(respComplaint)
        respComplaint.data.forEach(complaint => {
          this.api.getProfile(complaint.patientId)
            .subscribe((respUser: any) => {
              if(respUser.data[0].avatar == "" || respUser.data[0].avatar.data == null) {
                if(respUser.data[0].gender == "men") {
                  respUser.data[0].avatar = "../../assets/images/men.jpg"
                } else {
                  respUser.data[0].avatar = "../../assets/images/women.jpg"
                }
              } else {
                respUser.data[0].avatar = MEDIA+"/media/"+respUser.data[0]._id;
              }
              complaint.patient = respUser.data[0]
              this.loadChatList(respComplaint.data)
            })
            this.loadChatList(respComplaint.data)
        });
      })
      
    } else if($event.detail.value == 'conseling') {
      
      this.apiCategory.getCategories()
      .subscribe((categories: any) => {
        this.categories = categories.data
        this.apiConseling.getMyConseling(id)
        .subscribe((res: any) => {
          res.data.forEach(conseling => {
            this.apiConseling.getComplaintId(conseling.complaint_id)
            .subscribe((respComplaint: any) => {
              conseling.complaint_data = respComplaint.data
            })
            this.apiConseling.getMyScheduleConseling(conseling._id)
            .subscribe((respSchedule: any) => {
              conseling.schedule = respSchedule.data[0];
            })
            this.api.getProfile(conseling.patientId)
            .subscribe((respUser: any) => {
              if(respUser.data[0].avatar == "" || respUser.data[0].avatar.data == null) {
                if(respUser.data[0].gender == "men") {
                  respUser.data[0].avatar = "../../assets/images/men.jpg"
                } else {
                  respUser.data[0].avatar = "../../assets/images/women.jpg"
                }
              } else {
                respUser.data[0].avatar = MEDIA+"/media/"+respUser.data[0]._id;
              }
              conseling.patient = respUser.data[0]
            })
            this.conselingData.push(conseling)
          });
          if(this.segmentValue == 'schedule') {
            this.api.getWeekly(id).subscribe((res: any) => {
              console.log(res)
              this.loadWeekly(res.data[0])
            })
          }
        })
        if(this.role == 9) {
          this.adminApi.getComplain()
          .subscribe((res: any) => {
            res.data.forEach(element => {
              if(element.status != 9) {
                this.complaintTotal ++;
              }
            });
          })
        }
        this.loadConselingList({conseling: this.conselingData, categories: this.categories})
      })
    } else if($event.detail.value == 'schedule') {
      this.api.getWeekly(id).subscribe((res: any) => {
        console.log(res)
        this.loadWeekly(res.data[0])
      })
    }
  }

  statusActive() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('set-nickname', id)
    setTimeout(() => {
      this.statusActive()
    }, 3000)
  }

  loadChatList(elementData): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ListChatPage);
    const viewContainerRef = this.listChatDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const conselingSchedule = (<ListChatPage>componentRef.instance);
    conselingSchedule.listConseling = elementData;
    conselingSchedule.peer = this.peer
  }

  loadConselingList(elementData): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ListConselingPage);
    const viewContainerRef = this.listConselingDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const conselingSchedule = (<ListConselingPage>componentRef.instance);
    conselingSchedule.listConseling = elementData.conseling;
    conselingSchedule.categories = elementData.categories;
  }

  loadWeekly(elementData): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WeeklyPage);
    const viewContainerRef = this.weeklyDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const conselingSchedule = (<WeeklyPage>componentRef.instance);
    conselingSchedule.weekly = elementData.week;
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    conselingSchedule.weekId = id;
  }

  loadAdmin(elementData): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AdministratorPage);
    const viewContainerRef = this.administratorDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const conselingSchedule = (<AdministratorPage>componentRef.instance);
    // conselingSchedule.weekly = elementData.week;
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    conselingSchedule.categories = this.categories;
  }

  logoutConfirm() {
    this.router.navigateByUrl('logout')
  }


  getActiveUser() {
    let observable = new Observable(obs => {
      this.socket.on('users-changed', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  ionViewDidLeave() {
    this.socket.emit('disconnect')
  }
  ionViewWillEnter() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    this.role = JSON.parse(storeLocal).role
  }

  controlConseling(segment) {
    console.log(segment)
    this.segmentValue = segment;
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID;
    if(segment == 'chat'){
      this.apiConseling.getComplaintConselor(id)
      .subscribe((respComplaint: any) => {
        console.log(respComplaint)
        respComplaint.data.forEach(complaint => {
          this.api.getProfile(complaint.patientId)
            .subscribe((respUser: any) => {
              if(respUser.data[0].avatar == "" || respUser.data[0].avatar.data == null) {
                if(respUser.data[0].gender == "men") {
                  respUser.data[0].avatar = "../../assets/images/men.jpg"
                } else {
                  respUser.data[0].avatar = "../../assets/images/women.jpg"
                }
              } else {
                respUser.data[0].avatar = MEDIA+"/media/"+respUser.data[0]._id;
              }
              complaint.patient = respUser.data[0]
            })
          });
          this.loadChatList(respComplaint.data)
      })
      
    } else if(segment == 'conseling') {
      this.loadConselingList({conseling: this.conselingData, categories: this.categories})
    } else if(segment == 'schedule') {
      this.api.getWeekly(id).subscribe((res: any) => {
        console.log(res)
        this.loadWeekly(res.data[0])
      })
    } else if (segment == 'complaint') {
      this.loadAdmin("tes")
    }
  }
}
