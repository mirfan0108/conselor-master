import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logo: any;
  formLogin = {
    email: '',
    password: ''
  }
  loading = false;

  constructor(private formBuilder: FormBuilder, private api : UserServiceService,
    private route: ActivatedRoute, private router: Router) {

   }

  ngOnInit() {
    this.logo = '../../../assets/images/logo-cons.png'
  }

  doLogin(){
    
    let timerInterval;
    Swal.fire({
      title: '<strong>Mohon Tunggu</strong>',
      text: 'Sedang dalam proses',
      timer: 3000,
      onBeforeOpen: () => {
        // this.doLogin()
        this.loading = true;
        Swal.showLoading();
        timerInterval = setInterval(() => {
        }, 3000)
      },
      onOpen: async () => {
        Swal.stopTimer();
        try {
          await this.api.login(this.formLogin).subscribe(async (res: any) => {
            let user = res[0];
            if(res.length > 0) {
              if (user._id) {
                if(user._id) {
                  await localStorage.setItem("_USER", JSON.stringify({_ID: user._id, role:user.role, status:user.status}));
                }
              } 
            } else {
              Swal.fire('Oops...', 'Password atau email tidak sesuai!', 'error')
              this.loading = false;
            }
          })
          
        } catch (error) {
          console.log(error)
        }
        
        Swal.resumeTimer();
      },
      onClose: () => {
        this.loading = false;
        if (localStorage.getItem("_USER")) {
          let storeLocal = localStorage.getItem('_USER');
          let role = JSON.parse(storeLocal).role;
          if(role == 9) {
            window.location.href = "home"
            // this.router.navigateByUrl('home')
          } else {
            window.location.href = "home"
            // this.router.navigateByUrl('home')
          }
        } 
        clearInterval(timerInterval)
      }
    })
  }

  navigateTo(page: 'signup' | 'forget') {
    switch (page) {
      case 'signup':
        this.router.navigateByUrl('register')
        break;
      case 'forget': 
        this.router.navigateByUrl('forget/change-password')
        break;
      default:
        break;
    }
  }

}
