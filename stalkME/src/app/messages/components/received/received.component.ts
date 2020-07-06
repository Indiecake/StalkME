import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {
  title: string;
  constructor(private titleService: Title) {
    this.title = 'Mensajes recibidos ';
    titleService.setTitle(`${this.title} | StalkMe`);
   }

  ngOnInit(): void {
  }

}
