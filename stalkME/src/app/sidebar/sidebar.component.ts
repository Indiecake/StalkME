import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { global } from "../services/global";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {
  token: string;
  url: string;
  status: string;
  identity;
  stats: any;

  constructor(private _userService: UserService) { 
    this.identity = this._userService.getIdentity();
    this.token = _userService.getToken();
    this.url = global.url;
    this.stats = _userService.getStats();
  }

  ngOnInit(): void {
    
  }

}
