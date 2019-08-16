import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
  }

  cancelLogout(){
    let storeLocal = localStorage.getItem('_USER');
    let role = JSON.parse(storeLocal).role;
    this.router.navigateByUrl('home')
    
    
  }

  async doLogout(){
    await localStorage.clear();
    await localStorage.setItem('_firstTime', "false")
    this.router.navigateByUrl('login');
    this.modalCtrl.dismiss()
  }

}
