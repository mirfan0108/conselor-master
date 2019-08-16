import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { UserServiceService } from 'src/app/user/user-service.service';
import { environment } from 'src/environments/environment'
const MEDIA = environment.imageUrl;
declare var apiRTC: any;

@Component({
  selector: 'app-caller',
  templateUrl: './caller.page.html',
  styleUrls: ['./caller.page.scss'],
})
export class CallerPage implements OnInit {
  @Input() id: any;
  @Input() peer: any;
  @Input() to: any;
  @Input() from: any;
  @Input() ongoing: any = false;

  micOff = false;
  volumeOff = false;
  fromUser: any;
  toUser: any;

  @ViewChild('videoContainer') videoContainer;
  private video: HTMLVideoElement;
  private testVideo: HTMLVideoElement;
  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private streamingMedia: StreamingMedia,
    private modalCtrl: ModalController, private socket: Socket, private diagnostic: Diagnostic,
    public navCtrl: NavController,private nativeAudio: NativeAudio, private apiUser: UserServiceService) {
    this.video = document.createElement('video');
    this.video.width = 640;
    this.video.height = 480;
    this.video.setAttribute('autoplay', '');
    // this.platform.ready().then((value: any) => {
    //   console.log(value)
    //   if(value == "android") {
    //     // this.streamingMedia.playVideo(this.video.src)
    //   } else {
    //     console.log(value)
    //   }
    // })
   }

  ngOnInit() {
    this.apiUser.getProfile(this.from).subscribe((fromUser: any) => {
      if(fromUser.data[0].avatar == "" || fromUser.data[0].avatar.data == null) {
        if(fromUser.data[0].gender == "men") {
          fromUser.data[0].avatar = "../../assets/images/men.jpg"
        } else {
          fromUser.data[0].avatar = "../../assets/images/women.jpg"
        }
      } else {
        fromUser.data[0].avatar = MEDIA+"/media/"+fromUser.data[0]._id;
      }
      this.fromUser = fromUser.data[0]

      this.apiUser.getProfile(this.to).subscribe((toUser: any) => {
        if(toUser.data[0].avatar == "" || toUser.data[0].avatar.data == null) {
          if(toUser.data[0].gender == "men") {
            toUser.data[0].avatar = "../../assets/images/men.jpg"
          } else {
            toUser.data[0].avatar = "../../assets/images/women.jpg"
          }
        } else {
          toUser.data[0].avatar = MEDIA+"/media/"+toUser.data[0]._id;
        }
        this.toUser = toUser.data[0]
      })
    })
    console.log(this.to)
    console.log(this.from)
    this.videoContainer.nativeElement.appendChild(this.video);
    console.log(this.peer)
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    if(this.ongoing == false) {
      this.tryCall()
    }
    this.getOngoing().subscribe((user: any) => {
      console.log(user.user.data)
      if(user.user.data.from == id && !this.ongoing) {
        this.onGoingCall()
      } else {
        this.receiveCall();
      }
    })
    this.receiveCall();
    this.getClosedCall().subscribe((user: any) => {
      console.log(user)
      if(user.user.data.to == id || user.user.data.from == id) {
          window.location.href="home"
      }
    })
  }
  tryCall() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('try-call', 
        {
          data: {
            to: this.to,
            from: id
          }
        })
  }
  getOngoing() {
    let observable = new Observable(obs => {
      this.socket.on('call-connect', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
  onGoingCall() {
    const constraints = {
      video: false,
      audio: true
    };
    this.peer = this.peer;
    console.log(this.to)
    var getUserMedia = navigator.getUserMedia;
    var getUserMediaD = navigator.mediaDevices.getUserMedia;
    getUserMediaD(constraints).then(stream => {
      var call = this.peer.call(this.to, stream);
      call.on('stream', (remoteStream: any) => {
        // Show stream in some video/canvas element.
        (<any>window).stream = stream; // make stream available to browser console
        this.video.srcObject = stream;
        this.video.play()
        this.platform.ready().then((value: any) => {
          console.log(value)
          if(value == "android") {
            this.streamingMedia.playVideo(this.video.src)
          } else {
            console.log(value)
          }
        })
      });
      call.on("close", () => {
        console.log("by")
      })
    })
  }

  

  setMic() {
    this.micOff = !this.micOff
  }

  setVolume() {
    this.volumeOff = !this.volumeOff
  }

  receiveCall() {
    const constraints = {
      video: false,
      audio: true
    };
    var getUserMedia = navigator.mediaDevices.getUserMedia ;
    this.peer.on('call', (call: any) => {
      getUserMedia(constraints).then(stream => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', (remoteStream: any) => {
          // Show stream in some video/canvas element.
          (<any>window).stream = stream; // make stream available to browser console
          this.video.srcObject = stream;
        });
        call.on("close", () => {
          console.log("by")
        })
      })
    });
  }

  closeCall() {
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('end-call', 
        {
          data: {
            to: this.to,
            from: this.from
          }
        })
        window.location.href="home"
  }
  getClosedCall() {
    let observable = new Observable(obs => {
      this.socket.on('call-end', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

}
