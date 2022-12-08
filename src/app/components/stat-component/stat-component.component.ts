import { Component, Input, OnInit } from '@angular/core';
import { Stat } from 'src/app/core/models/Stat';

@Component({
  selector: 'app-stat-component',
  templateUrl: './stat-component.component.html',
  styleUrls: ['./stat-component.component.scss']
})
export class StatComponentComponent {

  @Input() stat!: Stat

}
