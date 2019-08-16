import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

const config: SocketIoConfig = {url: 'https://beckend-conseling.herokuapp.com', options: {}};
// const config: SocketIoConfig = {url: 'http://localhost:8080', options: {}};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule, 
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(), 
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    StreamingMedia,
    Diagnostic,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
