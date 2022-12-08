import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Stat } from 'src/app/core/models/Stat';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  public countriesStat!: Stat;
  public olympicGamesStat = { label: 'Number of JOs', data: '20' };

  public pieChartData!: Array<{ name: string, value: number }>;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    
    this.olympics$.subscribe(allCountriesData => {
      this.countriesStat = { label: 'Number of countries',  data: allCountriesData.length.toString() };
      this.olympicGamesStat = { label: "Number of JOs" , data: allCountriesData[0].participations.length.toString()};
      this.pieChartData = [];

      allCountriesData.forEach(countryData => {
        this.pieChartData.push({
          name: countryData.country,
          value: countryData.participations.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.medalsCount;
          }, 0)
        })

      });
    })
  }

  onSelect(data: { name: string, value: number, label: string }): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
}
