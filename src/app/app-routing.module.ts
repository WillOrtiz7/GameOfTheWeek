import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { MainPageComponent } from './component/main-page/main-page.component';

const routes: Routes = [{path:"", component:LandingPageComponent}, {path:"mainPage", component:MainPageComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
