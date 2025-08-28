# Aircraft Tracking in LCARS Dashboard

## How It Works

The LCARS dashboard detects nearby aircraft using the **OpenSky Network API**, which provides real-time aircraft position data from around the world.

### Data Source: OpenSky Network

The OpenSky Network is a community-driven network that:
- Collects aircraft positions via ADS-B (Automatic Dependent Surveillance-Broadcast) receivers
- Aggregates data from thousands of sensors worldwide
- Provides free API access to real-time flight data
- Updates aircraft positions every few seconds

### Implementation Details

#### 1. API Query Structure
```typescript
const url = `https://opensky-network.org/api/states/all?lamin=${latMin}&lomin=${lonMin}&lamax=${latMax}&lomax=${lonMax}`;
```

**Parameters:**
- `lamin`: Minimum latitude (southern boundary)
- `lomin`: Minimum longitude (western boundary) 
- `lamax`: Maximum latitude (northern boundary)
- `lomax`: Maximum longitude (eastern boundary)

#### 2. Current Coverage Area
The dashboard is configured to show aircraft in the **San Francisco Bay Area**:
- Latitude: 37.0° to 38.5° North
- Longitude: -123.0° to -121.5° West
- This covers approximately 150km x 150km area

#### 3. Data Processing
Each aircraft state contains:
```typescript
interface FlightData {
  callsign: string;    // Flight number (e.g., "UAL1234")
  country: string;     // Aircraft registration country
  altitude: number;    // Barometric altitude in meters
  velocity: number;    // Ground speed in m/s
  latitude: number;    // GPS latitude
  longitude: number;   // GPS longitude
  track: number;       // Heading in degrees (0-360)
}
```

#### 4. Real-time Updates
- Aircraft positions update every **30 seconds**
- Dashboard displays up to **10 aircraft** simultaneously
- Automatic fallback to mock data if API is unavailable

### How ADS-B Works

**ADS-B (Automatic Dependent Surveillance-Broadcast)** is the technology behind the data:

1. **Aircraft Transmit**: Modern aircraft automatically broadcast their position, altitude, velocity, and other data
2. **Ground Receivers**: Radio receivers pick up these signals (1090 MHz frequency)
3. **Network Aggregation**: OpenSky Network collects data from thousands of receivers worldwide
4. **API Access**: Real-time data is made available through REST API

### Coverage and Limitations

#### Global Coverage
- **Best**: North America, Europe, parts of Asia
- **Good**: Major flight corridors worldwide
- **Limited**: Remote oceanic areas, some developing regions

#### Data Accuracy
- **Position**: ±10 meters typically
- **Altitude**: ±25 feet typically
- **Update Rate**: 1-2 seconds from aircraft, aggregated every few seconds

#### API Limitations
- **Rate Limits**: 400 calls per day for anonymous users
- **CORS**: Browser requests may be blocked (requires backend proxy in production)
- **Availability**: 99%+ uptime, but occasional maintenance

### Technical Implementation

#### Error Handling
```typescript
catchError(err => {
  console.warn('OpenSky API not available, using mock data:', err);
  return of({ states: null });
})
```

#### Data Filtering
```typescript
response.states
  .filter((state: any[]) => state[1] && state[6] && state[5]) // Has callsign, lat, lon
  .slice(0, 10) // Limit to 10 aircraft
```

#### Fallback System
When the API is unavailable:
- Automatic fallback to realistic mock data
- Maintains dashboard functionality
- User experience remains seamless

### Customization Options

#### Change Coverage Area
Modify the bounding box coordinates in `fetchNearbyFlights()`:
```typescript
const latMin = 40.0; // New York area
const latMax = 41.0;
const lonMin = -75.0;
const lonMax = -73.0;
```

#### Increase Aircraft Count
Change the slice limit:
```typescript
.slice(0, 20) // Show up to 20 aircraft
```

#### Adjust Update Frequency
Modify the interval in `initializeDataStreams()`:
```typescript
interval(15000) // Update every 15 seconds instead of 30
```

### Future Enhancements

Potential improvements:
1. **User Location**: Detect user's location for local aircraft
2. **Aircraft Details**: Show airline, aircraft type, departure/arrival airports
3. **Flight Paths**: Display projected routes and trajectories
4. **Filtering**: Filter by altitude, aircraft type, or airline
5. **3D Visualization**: Height-based visual representation
6. **Historical Data**: Show flight history and patterns

### Production Deployment

For production use:
1. **Backend Proxy**: Implement server-side API calls to avoid CORS
2. **API Key**: Register for higher rate limits
3. **Caching**: Cache responses to reduce API calls
4. **Error Monitoring**: Track API availability and performance
5. **User Preferences**: Allow users to set their location/coverage area

The aircraft tracking feature demonstrates how modern web applications can integrate real-world data streams to create engaging, informative experiences that feel truly connected to the physical world around us.