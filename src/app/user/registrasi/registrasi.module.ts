import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrasiPage } from './registrasi.page';
import { ConselorFormPage } from '../conselor-form/conselor-form.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrasiPage
  }
];

@NgModule({
  entryComponents: [
    ConselorFormPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RegistrasiPage, ConselorFormPage]
})
export class RegistrasiPageModule {}
