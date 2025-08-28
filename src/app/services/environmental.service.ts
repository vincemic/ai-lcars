import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap, catchError, of } from 'rxjs';
import { GeolocationService } from './geolocation.service';

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  location: string;
  icon: string;
}

export interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  status: string;
  location: string;
  timestamp: string;
}

export interface EarthquakeData {
  magnitude: number;
  location: string;
  depth: number;
  time: string;
  coordinates: [number, number];
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalService {
  private http = inject(HttpClient);
  private geolocationService = inject(GeolocationService);
  
  private weather$ = new BehaviorSubject<WeatherData | null>(null);
  private airQuality$ = new BehaviorSubject<AirQuality | null>(null);
  private recentEarthquakes$ = new BehaviorSubject<EarthquakeData[]>([]);

  constructor() {
    this.initializeDataStreams();
  }

  private initializeDataStreams() {
    // Update weather every 10 minutes
    interval(600000).pipe(
      switchMap(() => this.fetchWeather()),
      catchError(err => {
        console.error('Weather error:', err);
        return of(null);
      })
    ).subscribe(weather => {
      if (weather) this.weather$.next(weather);
    });

    // Update air quality every 15 minutes
    interval(900000).pipe(
      switchMap(() => this.fetchAirQuality()),
      catchError(err => {
        console.error('Air quality error:', err);
        return of(null);
      })
    ).subscribe(airQuality => {
      if (airQuality) this.airQuality$.next(airQuality);
    });

    // Update earthquakes every 30 minutes
    interval(1800000).pipe(
      switchMap(() => this.fetchRecentEarthquakes()),
      catchError(err => {
        console.error('Earthquake error:', err);
        return of([]);
      })
    ).subscribe(earthquakes => this.recentEarthquakes$.next(earthquakes));

    // Initial data fetch
    this.fetchInitialData();
  }

  private fetchInitialData() {
    this.fetchWeather().subscribe(weather => {
      if (weather) this.weather$.next(weather);
    });
    
    this.fetchAirQuality().subscribe(airQuality => {
      if (airQuality) this.airQuality$.next(airQuality);
    });
    
    this.fetchRecentEarthquakes().subscribe(earthquakes => 
      this.recentEarthquakes$.next(earthquakes)
    );
  }

  private fetchWeather(): Observable<WeatherData | null> {
    const location = this.geolocationService.getCurrentLocation();
    
    if (location) {
      // Use user's coordinates for weather data
      const lat = location.latitude;
      const lon = location.longitude;
      
      // Try OpenWeatherMap API (you'll need a real API key for production)
      // For demo, we'll use location-aware mock data
      const mockWeather: WeatherData = {
        temperature: Math.round(Math.random() * 30 + 10), // 10-40°C
        humidity: Math.round(Math.random() * 60 + 30), // 30-90%
        pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
        windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
        windDirection: Math.round(Math.random() * 360), // 0-360°
        description: ['Clear', 'Partly Cloudy', 'Overcast', 'Rain'][Math.floor(Math.random() * 4)],
        location: `${location.city}, ${location.region}`,
        icon: 'clear-day'
      };

      return of(mockWeather);
    } else {
      // Fallback weather data when location is not available
      const mockWeather: WeatherData = {
        temperature: Math.round(Math.random() * 30 + 10),
        humidity: Math.round(Math.random() * 60 + 30),
        pressure: Math.round(Math.random() * 50 + 1000),
        windSpeed: Math.round(Math.random() * 20 + 5),
        windDirection: Math.round(Math.random() * 360),
        description: ['Clear', 'Partly Cloudy', 'Overcast', 'Rain'][Math.floor(Math.random() * 4)],
        location: 'Starfleet Academy, San Francisco',
        icon: 'clear-day'
      };

      return of(mockWeather);
    }
  }

  private fetchAirQuality(): Observable<AirQuality | null> {
    const location = this.geolocationService.getCurrentLocation();
    
    // Mock air quality data (in production, use real API like World Air Quality Index)
    const aqi = Math.round(Math.random() * 150 + 25); // 25-175
    const status = aqi < 50 ? 'Good' : aqi < 100 ? 'Moderate' : aqi < 150 ? 'Unhealthy for Sensitive' : 'Unhealthy';
    
    const mockAirQuality: AirQuality = {
      aqi,
      pm25: Math.round(Math.random() * 50 + 10),
      pm10: Math.round(Math.random() * 80 + 20),
      status,
      location: location ? `${location.city}, ${location.region}` : 'Location Unknown',
      timestamp: new Date().toISOString()
    };

    return of(mockAirQuality);
  }

  private fetchRecentEarthquakes(): Observable<EarthquakeData[]> {
    return this.http.get<any>('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson').pipe(
      catchError(() => of({ features: [] })),
      switchMap(response => {
        const earthquakes: EarthquakeData[] = response.features.slice(0, 5).map((feature: any) => ({
          magnitude: feature.properties.mag,
          location: feature.properties.place,
          depth: feature.geometry.coordinates[2],
          time: new Date(feature.properties.time).toISOString(),
          coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
        }));
        
        return of(earthquakes);
      })
    );
  }

  // Public getters
  getWeather(): Observable<WeatherData | null> {
    return this.weather$.asObservable();
  }

  getAirQuality(): Observable<AirQuality | null> {
    return this.airQuality$.asObservable();
  }

  getRecentEarthquakes(): Observable<EarthquakeData[]> {
    return this.recentEarthquakes$.asObservable();
  }
}