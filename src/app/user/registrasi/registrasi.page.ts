import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import Swal from 'sweetalert2';
// import { ServicesService } from '../services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserServiceService } from '../user-service.service';
import { CategoryServiceService } from 'src/app/services/category-service.service';
import { ConselorFormPage } from '../conselor-form/conselor-form.page';
// import { UserAgrementPage } from 'src/app/starter/user-agrement/user-agrement.page';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.page.html',
  styleUrls: ['./registrasi.page.scss'],
})
export class RegistrasiPage implements OnInit {
  formRegist = {
    email: '',
    name: '',
    birth: '',
    hp: '',
    address: '',
    gender: 'men',
    avatar: null,
    password: '',
    confirmPassword: '',
    role: 1
  }

  bod: '';
  file: File;
  fileKtp: File;
  ktpName = ''
  fotoName = ''

  categories = [];

  constructor(private router: Router, public formBuilder: FormBuilder, private api : UserServiceService,
    private route: ActivatedRoute, private modalCtrl: ModalController, private apiCategories: CategoryServiceService) { }

  ngOnInit() {

    this.apiCategories.getCategories()
    .subscribe((res: any) => {
      let category;
      res.data.forEach(item => {
        category = {
          _id: item._id,
          text: item.category,
          checked: false
        }
        this.categories.push(category)
      });
    })
  }
  
  changeListener($event) : void {
      if($event.target.files[0]) {
        this.file = $event.target.files[0];
        if($event.target.files && $event.target.files[0]){
          let reader = new FileReader();
          reader.readAsDataURL($event.target.files[0]);
        }
          let fileList: FileList = $event.target.files;  
          this.fotoName = fileList[0].name
      }
    }
  changeListenerKtp($event) : void {
    if($event.target.files[0]) {
      this.fileKtp = $event.target.files[0];
      if($event.target.files && $event.target.files[0]){
        let reader = new FileReader();
        reader.readAsDataURL($event.target.files[0]);
      }
        let fileList: FileList = $event.target.files;  
        this.ktpName = fileList[0].name;
    }
  }

  doInputFile(element) {
    switch (element) {
      case 'foto':
        $('#input-avatar').click()
        break;
      case 'ktp':
        $('#input-ktp').click()
        break;
      default:
        break;
    }
  }

  navigateTo(page) {
    switch (page) {
      case 'login':
        this.router.navigateByUrl('login')
        break;
    
      default:
        break;
    }
  }

  openCalendar() {
    $('#cal-hide').click()
  }

  

  normalizeDate() {
    let date = this.formRegist.birth
    let dateChiper = date.split("T")
    let dateArr = dateChiper[0].split("-");
    let dateText;
    switch (dateArr[1]) {
      case "01":
        dateText = dateArr[2]+" Januari "+dateArr[0]
        break;
      case "02":
        dateText = dateArr[2]+" Februari "+dateArr[0]
        break;
      case "03":
        dateText = dateArr[2]+" Maret "+dateArr[0]
        break;
      case "04":
        dateText = dateArr[2]+" April "+dateArr[0]
        break;
      case "05":
        dateText = dateArr[2]+" Mei "+dateArr[0]
        break;
      case "06":
        dateText = dateArr[2]+" Juni "+dateArr[0]
        break;
      case "07":
        dateText = dateArr[2]+" Juli "+dateArr[0]
        break;
      case "08":
        dateText = dateArr[2]+" Agustus "+dateArr[0]
        break;
      case "09":
        dateText = dateArr[2]+" September "+dateArr[0]
        break;
      case "10":
        dateText = dateArr[2]+" Oktober "+dateArr[0]
        break;
      case "11":
        dateText = dateArr[2]+" November "+dateArr[0]
        break;
      case "12":
        dateText = dateArr[2]+" Desember "+dateArr[0]
        break;
      default:
        break;
    }
    this.bod = dateText;
  }

  checkRegist() {
    this.formRegist.avatar = this.file
    let msgErr = '';
    let validations_form = this.formBuilder.group({
      name: new FormControl(this.formRegist.name, Validators.required),
      email: new FormControl(this.formRegist.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      password: new FormControl(this.formRegist.password, Validators.compose([
        Validators.minLength(6)])),
    });
    if(!validations_form.controls.name.valid) {
      msgErr += "<small style='color:red'>* Nama tidak boleh kosong</small><br>"
      // this.validatorRegist.name.msg = "Nama tidak boleh kosong";
    }
    if(!validations_form.controls.email.valid) {
      msgErr += "<small style='color:red'>* Email tidak boleh kosong atau inputan tidak sesuai dengan format Email</small></br>";
      // this.validatorRegist.email.msg = "Email tidak boleh kosong atau inputan tidak sesuai dengan format Email";
    }
    if(!validations_form.controls.password.valid) {
      msgErr += "<small style='color:red'>* Password minimal 6 karakter</small></br>"
      // this.validatorRegist.password.msg = "Password minimal 6 karakter";
    }  
    if(validations_form.valid) {
      // this.doSubmit('signin')
      let form = {
        email: this.formRegist.email,
        name: this.formRegist.name,
        birth: this.formRegist.birth,
        address: this.formRegist.address,
        gender: this.formRegist.gender,
        avatar: this.file,
        password: this.formRegist.password,
        confirmPassword: this.formRegist.confirmPassword,
        role: this.formRegist.role
      }
      this.doRegist(form);
      // console.log(form)
    } else {
      Swal.fire({
        title: 'Opss..',
        type: 'error',
        html: msgErr,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        showConfirmButton: false,
        cancelButtonAriaLabel: 'Tutup',
      })
      console.log("Form = "+ false)
    }
    console.log(validations_form)
  }

  

  doRegist(form) {
    let timerInterval
    let formLogin = {
      email: this.formRegist.email,
      password: this.formRegist.password
    }
    Swal.fire({
      title: '<strong>Mohon Tunggu</strong>',
      text: 'Sedang dalam proses registrasi',
      timer: 3000,
      onBeforeOpen: () => {
        // this.doLogin()
        Swal.showLoading();
        timerInterval = setInterval(() => {
        }, 3000)
      },
      onOpen: async () => {
        Swal.stopTimer();
        await this.api.register(form).subscribe((resp: any) => {
          console.log(resp)
          if(resp.code == 409)  {
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: resp.msg
            })
            
          } else { 
            Swal.fire({
              title: '<strong>Mohon Tunggu</strong>',
              text: 'Proses login aplikasi ...',
              timer: 3000,
              onBeforeOpen: () => {
                // this.doLogin()
                Swal.showLoading();
                timerInterval = setInterval(() => {
                }, 3000)
              },
              onOpen: async () => {
                Swal.stopTimer();
                let formSpecialist;
                await this.api.login(formLogin).subscribe(async (res :any) => {
                  let user = res[0];
                  if(res.length > 0) {
                    if(res[0]._id) {
                      await this.categories.forEach(category => {
                        if(category.checked) {
                          formSpecialist = {
                            conselor_id: user._id,
                            categories_id: category._id
                          }
                          this.api.addSpecialist(formSpecialist).subscribe(res => console.log(res))
                        }
                      });
                      let formWeekly = {
                        conselor_id: user._id
                      }
                      await this.api.postWeekly(formWeekly).subscribe(weekly => console.log(weekly))
                      await localStorage.setItem("_USER", JSON.stringify({_ID: user._id, role:user.role, status:user.status}));
                      await localStorage.setItem('_firstTime', "true")
                    }
                  } 
                  
                });
                Swal.resumeTimer();
              },
              onClose: () => {
                clearInterval(timerInterval)
                this.router.navigateByUrl('home');
              }
            })
          }
        });
        Swal.resumeTimer();
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    })
  }

  async openForm() {
    const modal = await this.modalCtrl.create({
      component: ConselorFormPage,
      componentProps: {
        categories: this.categories,
      }
    });
    modal.onDidDismiss().then(res => {
      if(res.data) {
        console.log(res)
        this.categories = res.data.categories
        this.formRegist.role = res.data.role
        this.checkRegist()
      }
      // this.router.navigateByUrl('home')
    })
    return await modal.present();
  }
}
