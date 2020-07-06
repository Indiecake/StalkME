import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { FollowService } from "../../../services/follow.service";
import { User } from "../../../models/user";
import { Follow } from "../../../models/follows";
import { global } from "../../../services/global";
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  url: string;
  title: string;
  user: User;
  status: string;
  identity;
  token: string;
  stats;
  followed;
  following;

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private _userService: UserService, 
              private _followService: FollowService, 
              private titleService:Title) {
    this.title = 'Perfil';
    this.titleService.setTitle(`${this.title} | StalkMe`);
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.url = global.url;  
    this.following = false;
    this.followed = false;
  }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(){
    this.route.params.subscribe(params =>{
      let id = params['id'];
      this.getUser(id);
      this.getMetrics(id);
    });
  }

  getUser(id){
    this._userService.getUser(id).subscribe(
      Response => {        
        if (Response.user) {
          this.user = Response.user;
          
          if (Response.following && Response.following._id) {
            this.following = true;  
          }else {
            this.following = false;
          }

          if (Response.followed && Response.followed._id) {
            this.followed = true;  
          }else {
            this.followed = false;
          }
          
        }else{
          this.status = 'error';
        }
      },
      error => {
        let message = <any>error;
        console.log(message);
        if (message!= null) {
          this.status = 'error';
        }
        this.router.navigate(['/profile', this.identity._id])
      }
    );
  }

  getMetrics(id){
    this._userService.getMetrics(id).subscribe(
      Response => {        
        this.stats = Response;
      },
      error => {
        let message = <any>error;
        console.log(message);
        if (message!= null) {
          this.status = 'error';
        }
      }
    )
  }

  followUser(id){
    let follow = new Follow('', this.identity._id, id);

    this._followService.addFollow(this.token, follow).subscribe(
      Response => {
        this.following = true;
      },
      error => {
        let message = <any>error;
        console.log(message);
        if (message!= null) {
          this.status = 'error';
        }
      }
    );
  }

  unFollowUser(id) {
    this._followService.deleteFollow(this.token, id).subscribe(
      Response => {
        this.following = false;
      },
      error => {
        let message = <any>error;
        console.log(message);
        if (message!= null) {
          this.status = 'error';
        }
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id;
  }

  mouseLeave() {
    this.followUserOver = 0;
  }

}
