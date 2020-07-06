import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string
  constructor(private pageTitle: Title) {
    this.title = 'Bienvenido a StalkME';
    this.pageTitle.setTitle(`${this.title} | StalkMe`);
   }

  ngOnInit(): void {
  }

}
