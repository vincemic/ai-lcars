import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap, catchError, of, map } from 'rxjs';
import { GeolocationService } from './geolocation.service';

export interface FlightData {
  callsign: string;
  country: string;
  altitude: number;
  velocity: number;
  latitude: number;
  longitude: number;
  track: number;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface EconomicIndicator {
  name: string;
  value: number;
  change: number;
  unit: string;
  lastUpdated: string;
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  private http = inject(HttpClient);
  private geolocationService = inject(GeolocationService);
  
  private flights$ = new BehaviorSubject<FlightData[]>([]);
  private news$ = new BehaviorSubject<NewsItem[]>([]);
  private economicData$ = new BehaviorSubject<EconomicIndicator[]>([]);
  private cryptoData$ = new BehaviorSubject<CryptoCurrency[]>([]);

  constructor() {
    this.initializeDataStreams();
  }

  private initializeDataStreams() {
    // Update flights every 30 seconds
    interval(30000).pipe(
      switchMap(() => this.fetchNearbyFlights()),
      catchError(err => {
        console.error('Flights error:', err);
        return of([]);
      })
    ).subscribe(flights => this.flights$.next(flights));

    // Update news every 30 minutes
    interval(1800000).pipe(
      switchMap(() => this.fetchLatestNews()),
      catchError(err => {
        console.error('News error:', err);
        return of([]);
      })
    ).subscribe(news => this.news$.next(news));

    // Update economic data every hour
    interval(3600000).pipe(
      switchMap(() => this.fetchEconomicData()),
      catchError(err => {
        console.error('Economic data error:', err);
        return of([]);
      })
    ).subscribe(economic => this.economicData$.next(economic));

    // Update crypto data every 2 minutes
    interval(120000).pipe(
      switchMap(() => this.fetchCryptoData()),
      catchError(err => {
        console.error('Crypto data error:', err);
        return of([]);
      })
    ).subscribe(crypto => this.cryptoData$.next(crypto));

    // Initial data fetch
    this.fetchInitialData();
  }

  private fetchInitialData() {
    this.fetchNearbyFlights().subscribe(flights => this.flights$.next(flights));
    this.fetchLatestNews().subscribe(news => this.news$.next(news));
    this.fetchEconomicData().subscribe(economic => this.economicData$.next(economic));
    this.fetchCryptoData().subscribe(crypto => this.cryptoData$.next(crypto));
  }

  private fetchNearbyFlights(): Observable<FlightData[]> {
    // Get user's location bounds for nearby flights
    const bounds = this.geolocationService.getLocationBounds(150); // 150km radius
    
    if (!bounds) {
      // If no location available, use default area (San Francisco)
      return this.fetchFlightsForBounds(37.0, 38.5, -123.0, -121.5);
    }

    return this.fetchFlightsForBounds(bounds.latMin, bounds.latMax, bounds.lonMin, bounds.lonMax);
  }

  private fetchFlightsForBounds(latMin: number, latMax: number, lonMin: number, lonMax: number): Observable<FlightData[]> {
    // Real flight data using OpenSky Network API
    const url = `https://opensky-network.org/api/states/all?lamin=${latMin}&lomin=${lonMin}&lamax=${latMax}&lomax=${lonMax}`;
    
    return this.http.get<any>(url).pipe(
      catchError(err => {
        console.warn('OpenSky API not available, using mock data:', err);
        return of({ states: null });
      }),
      map(response => {
        if (!response || !response.states) {
          return this.getMockFlightDataSync();
        }
        
        const flights: FlightData[] = response.states
          .filter((state: any[]) => state[1] && state[6] && state[5]) // Has callsign, longitude, latitude
          .slice(0, 10) // Limit to 10 aircraft
          .map((state: any[]) => ({
            callsign: state[1].trim() || `UNKNOWN-${state[0]}`,
            country: state[2] || 'Unknown',
            altitude: state[7] || 0, // Barometric altitude in meters
            velocity: state[9] || 0, // Velocity in m/s
            latitude: state[6],
            longitude: state[5],
            track: state[10] || 0 // True track in degrees
          }));
          
        return flights.length > 0 ? flights : this.getMockFlightDataSync();
      })
    );
  }
  
  
  private getMockFlightDataSync(): FlightData[] {
    // Fallback mock flight data when real API is unavailable
    const mockFlights: FlightData[] = [];
    
    for (let i = 0; i < 8; i++) {
      mockFlights.push({
        callsign: `UAL${Math.floor(Math.random() * 9000) + 1000}`,
        country: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France'][Math.floor(Math.random() * 5)],
        altitude: Math.floor(Math.random() * 12000) + 3000, // 3000-15000m
        velocity: Math.floor(Math.random() * 300) + 200, // 200-500 m/s
        latitude: 37.7749 + (Math.random() - 0.5) * 2, // Around SF Bay Area
        longitude: -122.4194 + (Math.random() - 0.5) * 2,
        track: Math.floor(Math.random() * 360)
      });
    }

    return mockFlights;
  }

  private fetchLatestNews(): Observable<NewsItem[]> {
    // Mock news data (in production, use NewsAPI or similar)
    const mockNews: NewsItem[] = [
      {
        title: 'Breakthrough in Quantum Computing Research',
        description: 'Scientists achieve new milestone in quantum entanglement stability',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        source: 'Science Daily'
      },
      {
        title: 'International Space Station Receives New Crew',
        description: 'Three astronauts successfully dock with ISS for 6-month mission',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 7200000).toISOString(),
        source: 'Space News'
      },
      {
        title: 'Climate Monitoring Satellites Show Positive Trends',
        description: 'Latest environmental data indicates improvements in several key areas',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 10800000).toISOString(),
        source: 'Environmental Times'
      },
      {
        title: 'Global Communications Network Upgrade Complete',
        description: 'Enhanced bandwidth and security features now operational worldwide',
        url: '#',
        publishedAt: new Date(Date.now() - Math.random() * 14400000).toISOString(),
        source: 'Tech Today'
      }
    ];

    return of(mockNews);
  }

  private fetchEconomicData(): Observable<EconomicIndicator[]> {
    // Mock economic indicators
    const indicators: EconomicIndicator[] = [
      {
        name: 'Global GDP Growth',
        value: 3.2,
        change: 0.1,
        unit: '%',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Energy Production',
        value: 28420,
        change: 150,
        unit: 'TWh',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Carbon Efficiency',
        value: 92.7,
        change: 2.3,
        unit: '%',
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Population',
        value: 8.1,
        change: 0.02,
        unit: 'billion',
        lastUpdated: new Date().toISOString()
      }
    ];

    return of(indicators);
  }

  private fetchCryptoData(): Observable<CryptoCurrency[]> {
    // Mock cryptocurrency data (in production, use CoinGecko API)
    const cryptos: CryptoCurrency[] = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 45000 + Math.random() * 10000,
        change24h: (Math.random() - 0.5) * 10,
        marketCap: 850000000000
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3000 + Math.random() * 1000,
        change24h: (Math.random() - 0.5) * 15,
        marketCap: 360000000000
      },
      {
        symbol: 'FED',
        name: 'Federation Credits',
        price: 1.0,
        change24h: 0,
        marketCap: 1000000000000
      }
    ];

    return of(cryptos);
  }

  // Public getters
  getFlights(): Observable<FlightData[]> {
    return this.flights$.asObservable();
  }

  getNews(): Observable<NewsItem[]> {
    return this.news$.asObservable();
  }

  getEconomicData(): Observable<EconomicIndicator[]> {
    return this.economicData$.asObservable();
  }

  getCryptoData(): Observable<CryptoCurrency[]> {
    return this.cryptoData$.asObservable();
  }
}