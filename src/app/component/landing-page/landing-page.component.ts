import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  username:string = "";
  password:string = "";
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  login(): void{
    this.http.post("http://127.0.0.1:3000/login", JSON.stringify({username:this.username, password:this.password}));
  }

}
