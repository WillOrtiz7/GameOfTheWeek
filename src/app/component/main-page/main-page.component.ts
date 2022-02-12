import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/database';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  user!:User | null;
  avatarDropdown:boolean = false;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit(): void {
    if (!this.userService.user){
      this.router.navigateByUrl("/");
    }
    this.user = this.userService.user;
  }

  dropdown(): void{
    this.avatarDropdown = !this.avatarDropdown;
    console.log(this.avatarDropdown);
  }

  logOut(): void{
    this.userService.user = null;
    localStorage.clear();
    this.router.navigateByUrl("/");

  }

}
