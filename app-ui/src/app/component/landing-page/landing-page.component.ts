import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  username: string = '';
  password: string = '';
  failedLogin: boolean = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Redirects user to main page after refreshing if they are already logged in
    if (this.userService.user) {
      this.router.navigateByUrl('/mainPage');
    }
  }

  login(): void {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    this.http
      .post(
        environment.apiUrl + '/login',
        { username: this.username, password: this.password },
        { headers }
      )
      .subscribe((result: any) => {
        // Redirects user to main page after logging in
        if (result) {
          this.userService.user = result;
          this.router.navigateByUrl('/mainPage');
        } else {
          this.failedLogin = true;
        }
      });
  }
}
