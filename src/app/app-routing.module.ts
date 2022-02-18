import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { MainPageComponent } from './component/main-page/main-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'mainPage', component: MainPageComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
