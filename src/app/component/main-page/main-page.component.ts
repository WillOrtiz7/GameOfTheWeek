import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  votedHome:boolean = false;
  votedAway:boolean = false;

  constructor(private userService:UserService, private router:Router, private http:HttpClient) { }

  ngOnInit(): void {
    // If not logged in redirect to login page
    if (!this.userService.user){
      this.router.navigateByUrl("/");
    }
    // Setting voted home and away to what is stored in the database
    this.user = this.userService.user;
    this.votedHome = this.user?.votedHome || false;
    this.votedAway = this.user?.votedAway || false;

    this.http.post("http://localhost:3000/teams", {homeTeamName:"Falcons", awayTeamName:"Ravens"}).subscribe((result:any)=>{
      console.log(result);
    });
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

  vote(teamType:"home" | "away"): void{
    if (teamType == "home"){
      this.votedHome = true;
      this.votedAway = false;
      let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
      this.http.put("http://localhost:3000/vote", {username:this.user?.userName, votedHome:this.votedHome, votedAway:this.votedAway}).subscribe((result:any)=>{
        // Redirects user to main page after logging in
        let user = this.user || {}as User;
        user.votedHome = this.votedHome;
        user.votedAway = this.votedAway;
        this.userService.user = user;
      });
    }
    else{
      this.votedAway = true;
      this.votedHome = false;
      let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
      this.http.put("http://localhost:3000/vote", {username:this.user?.userName, votedHome:this.votedHome, votedAway:this.votedAway}).subscribe((result:any)=>{
        // Redirects user to main page after logging in
        let user = this.user || {}as User;
        user.votedHome = this.votedHome;
        user.votedAway = this.votedAway;
        this.userService.user = user;
      });
    }
    console.log("Voted home: " + this.votedHome + " Voted away: " + this.votedAway);
  }
}
