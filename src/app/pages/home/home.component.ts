import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Stat } from 'src/app/core/models/Stat';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<Olympic[]>;
  public countriesStat!: Stat;
  public olympicGamesStat!: Stat;
  private subscription!: Subscription;

  public pieChartData!: Array<{ name: string, value: number }>;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.subscription = this.olympics$?.subscribe(allCountriesData => {
      this.countriesStat = { label: 'Number of countries',  data: allCountriesData?.length.toString() };
      this.olympicGamesStat = { label: "Number of JOs" , data: allCountriesData?.[0].participations.length.toString()};
      this.pieChartData = [];

      allCountriesData?.forEach(countryData => {
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
    this.router.navigate(['countries', data.name]);
  }
}
