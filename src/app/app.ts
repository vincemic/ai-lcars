import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SpaceDataService, ISSPosition, Astronaut, SpaceXLaunch } from './services/space-data.service';
import { EnvironmentalService, WeatherData, AirQuality, EarthquakeData } from './services/environmental.service';
import { GlobalDataService, FlightData, NewsItem, EconomicIndicator, StockIndex, CryptoCurrency } from './services/global-data.service';
import { GeolocationService, LocationData } from './services/geolocation.service';
import { AudioService } from './services/audio.service';

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
  private audioService = inject(AudioService);

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
  stockIndices = signal<StockIndex[]>([]);
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
  
  // Tactical system properties
  readonly phaserStatus = signal<'ARMED' | 'STANDBY'>('STANDBY');
  readonly torpedoStatus = signal<'ARMED' | 'STANDBY'>('STANDBY');
  readonly torpedoCount = signal(12);
  readonly shieldStatus = signal<'UP' | 'DOWN'>('DOWN');
  readonly shieldPower = signal(100);
  readonly longRangeScanRange = signal(15.5);
  readonly shortRangeScanRange = signal(250);
  readonly deflectorStatus = signal<'ACTIVE' | 'STANDBY'>('ACTIVE');
  readonly threatLevel = signal<'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'>('NONE');
  readonly alertStatus = signal<'GREEN' | 'YELLOW' | 'RED'>('GREEN');
  readonly hasTarget = signal(false);
  readonly targetRange = signal('N/A');
  readonly targetBearing = signal('N/A');
  readonly targetVelocity = signal('N/A');
  
  // Dashboard state
  activeSection = signal('SPACE');
  
  alerts: Alert[] = [
    { message: 'SYSTEM NOMINAL', priority: 'low' },
    { message: 'ISS TRACKING ACTIVE', priority: 'low' },
    { message: 'DATA STREAMS ONLINE', priority: 'low' }
  ];

  ngOnInit() {
    // Play startup sound on initialization
    setTimeout(() => {
      this.audioService.playSystemStartup();
    }, 500);

    // Subscribe to real-time data streams
    this.subscribeToDataStreams();
    
    // Subscribe to location data
    this.geolocationService.getLocation().subscribe((location: LocationData | null) => {
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

    // Simulate tactical sensor updates
    setInterval(() => {
      this.updateTacticalSensors();
    }, 5000);

    // Simulate threat assessment
    setInterval(() => {
      this.assessThreats();
    }, 10000);
  }

  private subscribeToDataStreams() {
    // Space data subscriptions
    this.spaceDataService.getISSPosition().subscribe(position => {
      console.log('Received ISS position in component:', position);
      this.issPosition.set(position);
      if (position) {
        this.updateAlert('ISS Position Updated', 'low');
        console.log('ISS position signal set:', this.issPosition());
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

    this.globalDataService.getStockIndices().subscribe(stocks => {
      this.stockIndices.set(stocks);
    });

    this.globalDataService.getCryptoData().subscribe(crypto => {
      this.cryptoPrices.set(crypto);
    });
  }

  private updateAlert(message: string, priority: 'low' | 'medium' | 'high') {
    // Play alert sound for medium/high priority alerts
    if (priority === 'medium' || priority === 'high') {
      this.audioService.playAlert();
    }
    
    // Remove old alerts of same type and add new one
    this.alerts = this.alerts.filter(alert => alert.message !== message);
    this.alerts.unshift({ message, priority });
    
    // Keep only last 5 alerts
    if (this.alerts.length > 5) {
      this.alerts = this.alerts.slice(0, 5);
    }
  }

  setActiveSection(section: string) {
    // Play button press sound
    this.audioService.playButtonPress();
    this.activeSection.set(section);
  }

  onWarpSpeedChange(event: Event) {
    // Play data transfer sound for system changes
    this.audioService.playDataTransfer();
    const target = event.target as HTMLInputElement;
    this.warpSpeed.set(parseInt(target.value));
  }

  onAudioToggle() {
    this.audioService.toggleAudio();
    // Play confirmation sound if audio is being enabled
    if (this.audioService.isAudioEnabled()) {
      setTimeout(() => this.audioService.playButtonPress(), 100);
    }
  }

  isAudioEnabled(): boolean {
    return this.audioService.isAudioEnabled();
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

  // Tactical system methods
  updateTacticalSensors() {
    // Simulate sensor range variations
    this.longRangeScanRange.set(15 + Math.random() * 2);
    this.shortRangeScanRange.set(240 + Math.random() * 20);
    
    // Simulate target detection
    if (Math.random() > 0.7) {
      this.hasTarget.set(true);
      this.targetRange.set(`${(Math.random() * 1000 + 100).toFixed(1)} KM`);
      this.targetBearing.set(`${Math.floor(Math.random() * 360)}°`);
      this.targetVelocity.set(`${(Math.random() * 50 + 10).toFixed(1)} KM/S`);
    } else {
      this.hasTarget.set(false);
      this.targetRange.set('N/A');
      this.targetBearing.set('N/A');
      this.targetVelocity.set('N/A');
    }
  }

  assessThreats() {
    const threats = ['NONE', 'LOW', 'MEDIUM', 'HIGH'] as const;
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    this.threatLevel.set(randomThreat);
    
    if (randomThreat === 'HIGH' && this.alertStatus() === 'GREEN') {
      this.setYellowAlert();
    }
  }

  togglePhasers() {
    const newStatus = this.phaserStatus() === 'ARMED' ? 'STANDBY' : 'ARMED';
    this.phaserStatus.set(newStatus);
    this.audioService.playButtonPress();
    
    if (newStatus === 'ARMED') {
      this.updateAlert('PHASERS ARMED', 'medium');
    } else {
      this.updateAlert('PHASERS ON STANDBY', 'low');
    }
  }

  firePhasers() {
    if (this.phaserStatus() !== 'ARMED') {
      this.updateAlert('PHASERS NOT ARMED', 'medium');
      this.audioService.playButtonPress();
      return;
    }

    this.audioService.playPhaserFire();
    this.updateAlert('PHASERS FIRED', 'high');
    
    // Simulate power drain and recharge cycle
    const currentPower = this.powerLevels();
    this.powerLevels.set(Math.max(85, currentPower - 5));
    
    setTimeout(() => {
      this.powerLevels.set(Math.min(100, this.powerLevels() + 2));
    }, 2000);
  }

  toggleTorpedoes() {
    const newStatus = this.torpedoStatus() === 'ARMED' ? 'STANDBY' : 'ARMED';
    this.torpedoStatus.set(newStatus);
    this.audioService.playButtonPress();
    
    if (newStatus === 'ARMED') {
      this.updateAlert('TORPEDOES ARMED', 'medium');
    } else {
      this.updateAlert('TORPEDOES ON STANDBY', 'low');
    }
  }

  fireTorpedoes() {
    if (this.torpedoStatus() !== 'ARMED') {
      this.updateAlert('TORPEDOES NOT ARMED', 'medium');
      this.audioService.playButtonPress();
      return;
    }

    if (this.torpedoCount() <= 0) {
      this.updateAlert('NO TORPEDOES LOADED', 'medium');
      this.audioService.playButtonPress();
      return;
    }

    this.audioService.playTorpedoFire();
    this.torpedoCount.set(this.torpedoCount() - 1);
    this.updateAlert(`TORPEDO FIRED - ${this.torpedoCount()} REMAINING`, 'high');
    
    // Simulate power drain
    const currentPower = this.powerLevels();
    this.powerLevels.set(Math.max(80, currentPower - 8));
    
    setTimeout(() => {
      this.powerLevels.set(Math.min(100, this.powerLevels() + 3));
    }, 3000);
  }

  toggleShields() {
    const newStatus = this.shieldStatus() === 'UP' ? 'DOWN' : 'UP';
    this.shieldStatus.set(newStatus);
    this.audioService.playButtonPress();
    
    if (newStatus === 'UP') {
      this.updateAlert('SHIELDS RAISED', 'medium');
    } else {
      this.updateAlert('SHIELDS LOWERED', 'low');
    }
  }

  setRedAlert() {
    this.alertStatus.set('RED');
    this.audioService.playAlert();
    this.updateAlert('RED ALERT - ALL HANDS TO BATTLE STATIONS', 'high');
  }

  setYellowAlert() {
    this.alertStatus.set('YELLOW');
    this.audioService.playButtonPress();
    this.updateAlert('YELLOW ALERT - HEIGHTENED READINESS', 'medium');
  }

  setGreenAlert() {
    this.alertStatus.set('GREEN');
    this.audioService.playButtonPress();
    this.updateAlert('ALL CLEAR - NORMAL OPERATIONS', 'low');
  }
}
