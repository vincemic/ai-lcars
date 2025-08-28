import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  protected readonly title = signal('USS Enterprise LCARS');
  
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
  
  alerts: Alert[] = [
    { message: 'SYSTEM NOMINAL', priority: 'low' },
    { message: 'ROUTINE MAINTENANCE DUE', priority: 'medium' }
  ];

  ngOnInit() {
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
}
