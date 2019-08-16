import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'starter', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard]},
  { path: 'home/:slug', loadChildren: './home/home.module#HomePageModule', canActivate: [AuthGuard]},
  { path: 'starter', loadChildren: './starter/starter.module#StarterPageModule' },
  { path: 'login', loadChildren: './user/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './user/registrasi/registrasi.module#RegistrasiPageModule' },
  { path: 'forget/change-password', loadChildren: './user/forget-password/forget-password.module#ForgetPasswordPageModule' },
  { path: 'logout', loadChildren: './user/logout/logout.module#LogoutPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
