import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  constructor() {
    // Initialize audio context on first user interaction
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Play LCARS button press sound
   */
  playButtonPress(): void {
    if (!this.isEnabled || !this.audioContext) return;

    // Resume audio context if suspended (required for autoplay policies)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create LCARS-style button press sound
    this.createLCARSButtonSound();
  }

  /**
   * Play LCARS alert sound
   */
  playAlert(): void {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.createLCARSAlertSound();
  }

  /**
   * Play LCARS system startup sound
   */
  playSystemStartup(): void {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.createLCARSStartupSound();
  }

  /**
   * Play LCARS data transfer sound
   */
  playDataTransfer(): void {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.createLCARSDataSound();
  }

  /**
   * Play phaser firing sound
   */
  playPhaserFire(): void {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.createPhaserFireSound();
  }

  /**
   * Play torpedo firing sound
   */
  playTorpedoFire(): void {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.createTorpedoFireSound();
  }

  /**
   * Toggle audio on/off
   */
  toggleAudio(): void {
    this.isEnabled = !this.isEnabled;
  }

  /**
   * Check if audio is enabled
   */
  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  private createLCARSButtonSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // LCARS button press: Quick chirp with slight pitch bend
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);

    // Volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  private createLCARSAlertSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // LCARS alert: Two-tone beep
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.25);
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime + 0.35);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.6);
  }

  private createLCARSStartupSound(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // LCARS startup: Rising sweep
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.8);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime + 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 1.0);
  }

  private createLCARSDataSound(): void {
    if (!this.audioContext) return;

    // Create rapid pulse sequence for data transfer
    for (let i = 0; i < 5; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1500 + (i * 100), this.audioContext.currentTime + (i * 0.1));

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + (i * 0.1));
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + (i * 0.1) + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (i * 0.1) + 0.08);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime + (i * 0.1));
      oscillator.stop(this.audioContext.currentTime + (i * 0.1) + 0.08);
    }
  }

  private createPhaserFireSound(): void {
    if (!this.audioContext) return;

    // Create multiple oscillators for complex phaser sound
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Main phaser beam sound
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.8);

    // High frequency component for energy crackle
    oscillator2.type = 'square';
    oscillator2.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(1000, this.audioContext.currentTime + 0.8);

    // Filter for characteristic phaser sound
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.8);

    // Volume envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime + 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 0.8);
    oscillator2.stop(this.audioContext.currentTime + 0.8);
  }

  private createTorpedoFireSound(): void {
    if (!this.audioContext) return;

    // Create torpedo launch sequence
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Launch whoosh sound
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.3);
    oscillator1.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 1.0);

    // High frequency propulsion sound
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
    oscillator2.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 1.0);

    // Volume envelope for torpedo launch
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 1.0);
    oscillator2.stop(this.audioContext.currentTime + 1.0);
  }
}