import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap, catchError, of } from 'rxjs';

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
}

export interface Astronaut {
  name: string;
  craft: string;
}

export interface SpaceXLaunch {
  name: string;
  date_utc: string;
  flight_number: number;
  rocket: string;
  success?: boolean;
  upcoming: boolean;
}

export interface SunriseSunset {
  sunrise: string;
  sunset: string;
  solar_noon: string;
  day_length: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpaceDataService {
  private http = inject(HttpClient);
  
  private issPosition$ = new BehaviorSubject<ISSPosition | null>(null);
  private astronauts$ = new BehaviorSubject<Astronaut[]>([]);
  private upcomingLaunches$ = new BehaviorSubject<SpaceXLaunch[]>([]);
  private solarData$ = new BehaviorSubject<SunriseSunset | null>(null);

  constructor() {
    this.initializeDataStreams();
  }

  private initializeDataStreams() {
    // Update ISS position every 5 seconds
    interval(5000).pipe(
      switchMap(() => this.fetchISSPosition()),
      catchError(err => {
        console.error('ISS position error:', err);
        return of(null);
      })
    ).subscribe(position => {
      if (position) this.issPosition$.next(position);
    });

    // Update astronauts every 5 minutes
    interval(300000).pipe(
      switchMap(() => this.fetchAstronauts()),
      catchError(err => {
        console.error('Astronauts error:', err);
        return of([]);
      })
    ).subscribe(astronauts => this.astronauts$.next(astronauts));

    // Update SpaceX launches every hour
    interval(3600000).pipe(
      switchMap(() => this.fetchUpcomingLaunches()),
      catchError(err => {
        console.error('SpaceX launches error:', err);
        return of([]);
      })
    ).subscribe(launches => this.upcomingLaunches$.next(launches));

    // Update solar data daily
    interval(86400000).pipe(
      switchMap(() => this.fetchSolarData()),
      catchError(err => {
        console.error('Solar data error:', err);
        return of(null);
      })
    ).subscribe(solar => {
      if (solar) this.solarData$.next(solar);
    });

    // Initial data fetch
    this.fetchInitialData();
  }

  private fetchInitialData() {
    this.fetchISSPosition().subscribe(pos => {
      if (pos) this.issPosition$.next(pos);
    });
    
    this.fetchAstronauts().subscribe(astronauts => 
      this.astronauts$.next(astronauts)
    );
    
    this.fetchUpcomingLaunches().subscribe(launches => 
      this.upcomingLaunches$.next(launches)
    );
    
    this.fetchSolarData().subscribe(solar => {
      if (solar) this.solarData$.next(solar);
    });
  }

  private fetchISSPosition(): Observable<ISSPosition | null> {
    return this.http.get<any>('http://api.open-notify.org/iss-now.json').pipe(
      catchError(() => of(null)),
      switchMap(response => {
        if (!response) return of(null);
        
        return of({
          latitude: parseFloat(response.iss_position.latitude),
          longitude: parseFloat(response.iss_position.longitude),
          altitude: 408, // Average ISS altitude in km
          timestamp: response.timestamp
        });
      })
    );
  }

  private fetchAstronauts(): Observable<Astronaut[]> {
    return this.http.get<any>('http://api.open-notify.org/astros.json').pipe(
      catchError(() => of({ people: [] })),
      switchMap(response => of(response.people || []))
    );
  }

  private fetchUpcomingLaunches(): Observable<SpaceXLaunch[]> {
    return this.http.get<SpaceXLaunch[]>('https://api.spacexdata.com/v4/launches/upcoming').pipe(
      catchError(() => of([])),
      switchMap(launches => of(launches.slice(0, 5))) // Get next 5 launches
    );
  }

  private fetchSolarData(): Observable<SunriseSunset | null> {
    // Using coordinates for San Francisco as default
    const lat = 37.7749;
    const lng = -122.4194;
    
    return this.http.get<any>(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`).pipe(
      catchError(() => of(null)),
      switchMap(response => {
        if (!response || response.status !== 'OK') return of(null);
        
        return of({
          sunrise: response.results.sunrise,
          sunset: response.results.sunset,
          solar_noon: response.results.solar_noon,
          day_length: response.results.day_length
        });
      })
    );
  }

  // Public getters for components
  getISSPosition(): Observable<ISSPosition | null> {
    return this.issPosition$.asObservable();
  }

  getAstronauts(): Observable<Astronaut[]> {
    return this.astronauts$.asObservable();
  }

  getUpcomingLaunches(): Observable<SpaceXLaunch[]> {
    return this.upcomingLaunches$.asObservable();
  }

  getSolarData(): Observable<SunriseSunset | null> {
    return this.solarData$.asObservable();
  }
}