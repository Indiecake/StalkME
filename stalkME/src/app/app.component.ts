import { Component, OnInit, DoCheck  } from '@angular/core';
import { UserService } from "./services/user.service";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  title:string;
  description:string;
  public identity;

  constructor(private _userServices: UserService,
    private router: Router, private route: ActivatedRoute){
    this.title = 'stalkMe';
    this.description = 'Hola Stalker';
  }

  ngOnInit() {
    this.identity = this._userServices.getIdentity();
  }

  ngDoCheck() {
    this.identity = this._userServices.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this.router.navigate(['/'])
  }
}
