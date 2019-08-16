import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vidcall',
  templateUrl: './vidcall.page.html',
  styleUrls: ['./vidcall.page.scss'],
})
export class VidcallPage implements OnInit {
  @ViewChild('videoContainer') videoContainer;
  @Input() peer: any;
  @Input() from: any;
  @Input() to: any;
  @Input() ongoing: any = false;
  @Input() incomingCall: any = false;
  @Input() apiRTC: any;

  //initial other
  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;
  userAgent: any;
  private video: HTMLVideoElement;
  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, private socket: Socket, private platform: Platform) { }

  ngOnInit() {
    this.video = document.createElement('video');
    this.video.width = 640;
    this.video.height = 480;
    this.video.setAttribute('autoplay', '');
    this.videoContainer.nativeElement.appendChild(this.video);
    this.initWebRTC();
    if(this.ongoing == false) {
      this.tryCall()
    }
    this.getOngoing().subscribe((user: any) => {
      if(user.user.data.to == this.to || user.user.data.from == this.from) {
        // this.openCaller(user.user.data)
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
    })
    this.getEndVidcall().subscribe((user: any) => {
      if(user.user.data.to == this.to || user.user.data.from == this.from) {
        window.location.href = "home"
      }
    })
  }

  tryCall() {
    
    this.initWebRTC();
    let storeLocal = localStorage.getItem('_USER');
    let id = JSON.parse(storeLocal)._ID
    this.socket.emit('try-vidcall', 
        {
          data: {
            to: this.to,
            from: this.from
          }
        })
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
      });
      call.on("close", () => {
        console.log("by")
      })
    })
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
          // if(value == "android") {
          //   this.streamingMedia.playVideo(this.video.src)
          // } else {
          //   console.log(value)
          // }
        })
      //   this.diagnostic.requestRuntimePermission((status) => {
      //     if(status.diagnostic.runtimePermissionStatus.GRANTED){
      //       (<any>window).stream = stream; // make stream available to browser console
      //       this.video.srcObject = stream;
      //     }
      
      // });
      });
      call.on("close", () => {
        console.log("by")
      })
    })
    // getUserMedia({video: false, audio: true}, (stream: any) => {
    //   var call = this.peer.call(this.to, stream);
    //   call.on('stream', (remoteStream: any) => {
    //     // Show stream in some video/canvas element.
    //     (<any>window).stream = stream; // make stream available to browser console
    //     this.video.srcObject = stream;
    //     var srcS = window.URL.createObjectURL(stream);
    //     console.log(srcS)
    //   });
    // },(err) => {
    //   console.log('Failed to get local stream' ,err);
    // });
  }

  initWebRTC() {
    
    const constraints = {
      video: true,
      audio: true
    };

    const handleSuccess = (stream: MediaStream) => {
      (<any>window).stream = stream; // make stream available to browser console
      this.video.srcObject = stream;
      
    };

    const handleError = (error: any) => {
      const p = document.createElement('p');
      p.innerHTML = 'navigator.getUserMedia error: ' + error.name + ', ' + error.message;
      this.videoContainer.nativeElement.appendChild(p);
    };

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
  }

  acceptCall() {
    this.incomingCall = false;
    this.socket.emit('start-vidcall', 
              {
                data: {
                  to: this.to,
                  from: this.from
                }
              })
    
  }

  endCall() {
    this.socket.emit('end-vidcall', 
              {
                data: {
                  to: this.to,
                  from: this.from
                }
              })
  }

  getEndVidcall() {
    let observable = new Observable(obs => {
      this.socket.on('vidcall-end', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }

  getOngoing() {
    let observable = new Observable(obs => {
      this.socket.on('vidcall-connect', data => {
        obs.next(data)
      }) 
    })
    return observable;
  }
}
