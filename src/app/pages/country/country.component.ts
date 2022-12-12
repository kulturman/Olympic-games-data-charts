import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Stat } from 'src/app/core/models/Stat';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit, OnDestroy {
  public countryName!: string;
  public entriesStat!: Stat;
  public medalsStat!: Stat;
  public athletesStat!: Stat;
  private olympics$!: Observable<Olympic[]>;
  public chartData!: Array<{ name: string, series: Array<{name: string, value: number}> }>;
  private subscription!: Subscription;

  constructor(private route: ActivatedRoute, private olympicService: OlympicService, private router: Router) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.countryName = params['country'];
    });
    this.olympics$ = this.olympicService.getOlympics();

    this.subscription = this.olympics$?.subscribe(allCountriesData => {
      const country: Olympic | undefined = allCountriesData?.find(data => data.country === this.countryName);

      if (!country && allCountriesData) {
        this.router.navigate(['']);
      }

      const totalNumberOfMedals = country?.participations.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.medalsCount;
      }, 0);

      const totalNumberOfAthletes = country?.participations.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.athleteCount;
      }, 0);

      this.entriesStat = { label: 'Number of entries', data: country ? country.participations?.length.toString(): ''};
      this.medalsStat = { label: 'Total number of medals', data: totalNumberOfMedals ? totalNumberOfMedals.toString(): ''};
      this.athletesStat = { label: 'Total number of athletes', data: totalNumberOfAthletes ? totalNumberOfAthletes.toString(): ''};

      this.chartData = [
        {
          name: this.countryName,
          series: country ? country.participations.map(participation => ({
            name: participation.year.toString(),
            value: participation.medalsCount
          })): []
        }
      ]
    })
  }

}
