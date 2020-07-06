import { Component, OnInit, DoCheck, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Message } from "../../../models/message";
import { Follow } from "../../../models/follows";
import { FollowService } from 'src/app/services/follow.service';
import { MessageService } from "../../../services/message.service";
import { UserService } from "../../../services/user.service";
import { global } from "../../../services/global";
import { Title } from '@angular/platform-browser';
import { AlertService } from "../../../services/alert.service";


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [MessageService, FollowService, UserService]
})
export class AddComponent implements OnInit {
  title: string;
  message: Message;
  identity;
  token: string;
  url: string;
  status: string;
  follows: Follow[];
  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private _messageService: MessageService, 
              private _followService: FollowService, 
              private _userService: UserService,
              private titleService: Title) {
    
    this.title = 'Enviar mensaje';
    titleService.setTitle(`${this.title} | StalkMe`);
    this.identity = this._userService.getIdentity();
    this.url = global.url;
    this.token = this._userService.getToken(); 
    this.message = new Message('', '', false, '', this.identity._id, '');
  }

  ngOnInit(): void {
    this.getMyFollows();
  }

  onSubmit(form){
    this._messageService.newMessage(this.token, this.message).subscribe(
      Response => {
        form.reset();
        AlertService.toastSuccess('Exito!', 'Mensaje enviado');
      },
      error => {
        AlertService.error('Error!', 'No se ha podido mandar el mensaje');
      }
    );
    
  }


  getMyFollows(){
    this._followService.getMyFollows(this.token).subscribe(
      Response => {        
        this.follows = Response.follows
      },
      error => {
        console.log(<any>error);
        AlertService.error('Oh no!', 'Ha ocurrido un error');
      }
    );
  }

}
