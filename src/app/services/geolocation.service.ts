import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of, map } from 'rxjs';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  timezone: string;
  isp: string;
  ip: string;
  accuracy?: number;
  source: 'ip' | 'gps' | 'mock';
}

export interface NearbyLocation {
  name: string;
  type: string;
  distance: number;
  bearing: number;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private http = inject(HttpClient);
  
  private location$ = new BehaviorSubject<LocationData | null>(null);
  private nearbyLocations$ = new BehaviorSubject<NearbyLocation[]>([]);

  constructor() {
    this.initializeLocation();
  }

  private async initializeLocation() {
    try {
      // Try GPS first for better accuracy
      const gpsLocation = await this.getGPSLocation();
      if (gpsLocation) {
        const enrichedLocation = await this.enrichLocationData(gpsLocation);
        this.location$.next(enrichedLocation);
        this.updateNearbyLocations(enrichedLocation);
        return;
      }
    } catch (error) {
      console.log('GPS not available, falling back to IP geolocation');
    }

    // Fallback to IP geolocation
    this.getIPLocation().subscribe(location => {
      this.location$.next(location);
      if (location) {
        this.updateNearbyLocations(location);
      }
    });
  }

  private getGPSLocation(): Promise<LocationData | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: '',
            region: '',
            country: '',
            countryCode: '',
            timezone: '',
            isp: '',
            ip: '',
            accuracy: position.coords.accuracy,
            source: 'gps'
          });
        },
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  private getIPLocation(): Observable<LocationData | null> {
    // Using ip-api.com for IP geolocation (free, no API key required)
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      map(response => {
        console.log('IP geolocation response:', response);
        if (response.city) {
          return {
            latitude: response.latitude,
            longitude: response.longitude,
            city: response.city,
            region: response.region,
            country: response.country_name,
            countryCode: response.country_code,
            timezone: response.timezone,
            isp: response.org || 'Unknown ISP',
            ip: response.ip,
            source: 'ip' as const
          };
        }
        return this.getMockLocation();
      }),
      catchError((error) => {
        console.warn('IP geolocation failed, using mock location:', error);
        return of(this.getMockLocation());
      })
    );
  }

  private getMockLocation(): LocationData {
    // Fallback mock location (San Francisco)
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      city: 'San Francisco',
      region: 'California',
      country: 'United States',
      countryCode: 'US',
      timezone: 'America/Los_Angeles',
      isp: 'Mock ISP',
      ip: '127.0.0.1',
      source: 'mock'
    };
  }

  private async enrichLocationData(location: LocationData): Promise<LocationData> {
    if (location.city) return location;

    // Reverse geocoding to get address info for GPS coordinates
    try {
      const response = await this.http.get<any>(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&addressdetails=1`
      ).toPromise();

      if (response && response.address) {
        return {
          ...location,
          city: response.address.city || response.address.town || response.address.village || 'Unknown',
          region: response.address.state || response.address.region || 'Unknown',
          country: response.address.country || 'Unknown',
          countryCode: response.address.country_code?.toUpperCase() || 'XX'
        };
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }

    return location;
  }

  private updateNearbyLocations(location: LocationData) {
    // Calculate nearby points of interest
    const nearby: NearbyLocation[] = [
      {
        name: 'Starfleet Headquarters',
        type: 'Landmark',
        distance: this.calculateDistance(location.latitude, location.longitude, 37.7749, -122.4194),
        bearing: this.calculateBearing(location.latitude, location.longitude, 37.7749, -122.4194),
        latitude: 37.7749,
        longitude: -122.4194
      },
      {
        name: 'International Space Station',
        type: 'Orbital',
        distance: 408, // ISS altitude in km
        bearing: 0,
        latitude: 0,
        longitude: 0
      }
    ];

    this.nearbyLocations$.next(nearby);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.degreesToRadians(lon2 - lon1);
    const lat1Rad = this.degreesToRadians(lat1);
    const lat2Rad = this.degreesToRadians(lat2);
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    let bearing = Math.atan2(y, x);
    bearing = this.radiansToDegrees(bearing);
    return (bearing + 360) % 360;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  // Public getters
  getLocation(): Observable<LocationData | null> {
    return this.location$.asObservable();
  }

  getNearbyLocations(): Observable<NearbyLocation[]> {
    return this.nearbyLocations$.asObservable();
  }

  getCurrentLocation(): LocationData | null {
    return this.location$.value;
  }

  // Get bounding box for current location (for flight tracking, weather, etc.)
  getLocationBounds(radiusKm: number = 100): { latMin: number, latMax: number, lonMin: number, lonMax: number } | null {
    const location = this.getCurrentLocation();
    if (!location) return null;

    const latDelta = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
    const lonDelta = radiusKm / (111 * Math.cos(this.degreesToRadians(location.latitude)));

    return {
      latMin: location.latitude - latDelta,
      latMax: location.latitude + latDelta,
      lonMin: location.longitude - lonDelta,
      lonMax: location.longitude + lonDelta
    };
  }

  // Format coordinates for display
  formatCoordinates(lat: number, lon: number): { latitude: string, longitude: string } {
    return {
      latitude: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`,
      longitude: `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`
    };
  }
}