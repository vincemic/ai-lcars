import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SpaceDataService, ISSPosition, Astronaut, SpaceXLaunch } from './services/space-data.service';
import { EnvironmentalService, WeatherData, AirQuality, EarthquakeData } from './services/environmental.service';
import { GlobalDataService, FlightData, NewsItem, EconomicIndicator, CryptoCurrency } from './services/global-data.service';
import { GeolocationService, LocationData } from './services/geolocation.service';

interface Alert {
  message: string;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private spaceDataService = inject(SpaceDataService);
  private environmentalService = inject(EnvironmentalService);
  private globalDataService = inject(GlobalDataService);
  private geolocationService = inject(GeolocationService);

  protected readonly title = signal('USS Enterprise LCARS');
  
  // Location data signal
  userLocation = signal<LocationData | null>(null);
  
  // Real-time data signals
  issPosition = signal<ISSPosition | null>(null);
  astronauts = signal<Astronaut[]>([]);
  upcomingLaunches = signal<SpaceXLaunch[]>([]);
  weather = signal<WeatherData | null>(null);
  airQuality = signal<AirQuality | null>(null);
  recentEarthquakes = signal<EarthquakeData[]>([]);
  nearbyFlights = signal<FlightData[]>([]);
  latestNews = signal<NewsItem[]>([]);
  economicIndicators = signal<EconomicIndicator[]>([]);
  cryptoPrices = signal<CryptoCurrency[]>([]);
  
  // Ship data properties
  currentStardate = signal('47457.1');
  shipTemperature = signal(20);
  hullIntegrity = signal(100);
  powerLevels = signal(97);
  crewCount = signal(1014);
  onDuty = signal(147);
  medicalStatus = signal('NOMINAL');
  warpSpeed = signal(0);
  currentTime = signal(new Date());
  
  // Dashboard state
  activeSection = signal('SPACE');
  
  alerts: Alert[] = [
    { message: 'SYSTEM NOMINAL', priority: 'low' },
    { message: 'ISS TRACKING ACTIVE', priority: 'low' },
    { message: 'DATA STREAMS ONLINE', priority: 'low' }
  ];

  ngOnInit() {
    // Subscribe to real-time data streams
    this.subscribeToDataStreams();
    
    // Subscribe to location data
    this.geolocationService.getLocation().subscribe(location => {
      this.userLocation.set(location);
    });
    
    // Update time every second
    setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);

    // Update stardate periodically
    setInterval(() => {
      const current = parseFloat(this.currentStardate());
      this.currentStardate.set((current + 0.1).toFixed(1));
    }, 5000);

    // Simulate some dynamic data changes
    setInterval(() => {
      this.shipTemperature.set(Math.floor(Math.random() * 5) + 18);
      this.powerLevels.set(Math.floor(Math.random() * 10) + 90);
    }, 3000);
  }

  private subscribeToDataStreams() {
    // Space data subscriptions
    this.spaceDataService.getISSPosition().subscribe(position => {
      this.issPosition.set(position);
      if (position) {
        this.updateAlert('ISS Position Updated', 'low');
      }
    });

    this.spaceDataService.getAstronauts().subscribe(astronauts => {
      this.astronauts.set(astronauts);
    });

    this.spaceDataService.getUpcomingLaunches().subscribe(launches => {
      this.upcomingLaunches.set(launches);
    });

    // Environmental data subscriptions
    this.environmentalService.getWeather().subscribe(weather => {
      this.weather.set(weather);
    });

    this.environmentalService.getAirQuality().subscribe(airQuality => {
      this.airQuality.set(airQuality);
    });

    this.environmentalService.getRecentEarthquakes().subscribe(earthquakes => {
      this.recentEarthquakes.set(earthquakes);
      if (earthquakes.length > 0) {
        const significant = earthquakes.filter(eq => eq.magnitude > 5.0);
        if (significant.length > 0) {
          this.updateAlert(`${significant.length} Significant Earthquakes Detected`, 'medium');
        }
      }
    });

    // Global data subscriptions
    this.globalDataService.getFlights().subscribe(flights => {
      this.nearbyFlights.set(flights);
    });

    this.globalDataService.getNews().subscribe(news => {
      this.latestNews.set(news);
    });

    this.globalDataService.getEconomicData().subscribe(economic => {
      this.economicIndicators.set(economic);
    });

    this.globalDataService.getCryptoData().subscribe(crypto => {
      this.cryptoPrices.set(crypto);
    });
  }

  private updateAlert(message: string, priority: 'low' | 'medium' | 'high') {
    // Remove old alerts of same type and add new one
    this.alerts = this.alerts.filter(alert => alert.message !== message);
    this.alerts.unshift({ message, priority });
    
    // Keep only last 5 alerts
    if (this.alerts.length > 5) {
      this.alerts = this.alerts.slice(0, 5);
    }
  }

  setActiveSection(section: string) {
    this.activeSection.set(section);
  }

  formatCoordinate(coord: number, isLatitude: boolean): string {
    const direction = isLatitude ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${Math.abs(coord).toFixed(4)}° ${direction}`;
  }

  formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins}m ago`;
    }
    return `${diffMins}m ago`;
  }
}
