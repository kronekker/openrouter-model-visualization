import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { SystemMetrics } from 'shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);
  
  metrics = signal<SystemMetrics | null>(null);
  serverConnected = signal<boolean>(false);
  branding = signal<{ logoAccent: string; logoThin: string; useImageLogo?: boolean }>({ logoAccent: 'KRONEKKER', logoThin: 'console', useImageLogo: true });
  
  private metricsIntervalId: any;

  ngOnInit() {
    this.loadConfig();
    this.loadMetrics();
    
    // Poll metrics every 5 seconds to keep the header connection status alive
    this.metricsIntervalId = setInterval(() => {
      this.loadMetrics();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.metricsIntervalId) {
      clearInterval(this.metricsIntervalId);
    }
  }

  loadMetrics() {
    this.apiService.getMetrics().subscribe({
      next: (metricsData) => {
        this.metrics.set(metricsData);
        this.serverConnected.set(true);
      },
      error: (err) => {
        console.error('Header telemetry connection check failed:', err);
        this.serverConnected.set(false);
      }
    });
  }

  loadConfig() {
    this.http.get<{ logoAccent: string; logoThin: string; useImageLogo?: boolean }>('/config.json').subscribe({
      next: (cfg) => this.branding.set(cfg),
      error: (err) => console.error('Failed to load branding config, using defaults:', err)
    });
  }
}

