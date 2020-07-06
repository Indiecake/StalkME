import { Component, OnInit, DoCheck } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title: string;

  constructor(private titleService: Title) {
    this.title = 'Mensajes privados';
    this.titleService.setTitle(`${this.title} | StalkMe`);
   }

  ngOnInit(): void {
    
  }


}
