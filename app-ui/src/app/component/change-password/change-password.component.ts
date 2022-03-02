import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'src/app/models/database';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  isBadOldPassword: boolean = false;
  isNotMatchingPassword: boolean = false;
  isInvalidPassword: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}
  changePassword(): void {
    if (this.oldPassword != this.userService.user?.password) {
      this.isBadOldPassword = true;
      setTimeout(() => {
        this.isBadOldPassword = false;
      }, 5000);
      return;
    }
    if (this.newPassword != this.confirmNewPassword) {
      this.isNotMatchingPassword = true;
      setTimeout(() => {
        this.isNotMatchingPassword = false;
      }, 5000);
      return;
    }
    if (this.newPassword.length < 1 || this.confirmNewPassword.length < 1) {
      this.isInvalidPassword = true;
      setTimeout(() => {
        this.isInvalidPassword = false;
      }, 5000);
      return;
    }
    this.http
      .post(environment.apiUrl + '/changePassword', {
        password: this.newPassword,
        _id: this.userService.user._id,
      })
      .subscribe((result: any) => {
        let user = this.userService.user;
        user!.password = this.newPassword;
        this.userService.user = user;
        this.router.navigateByUrl('/mainPage');
      });
  }
}
