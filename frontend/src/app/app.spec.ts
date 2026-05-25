import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('App', () => {
  let mockApiService: any;

  beforeEach(async () => {
    mockApiService = {
      getMetrics: () => of({
        cpuUsage: 10,
        memoryUsage: 20,
        freeMemory: '14 GB',
        totalMemory: '16 GB',
        uptime: 100,
        requestCount: 5,
        serverTime: new Date().toISOString(),
        port: 3000,
        logs: []
      })
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const httpMock = TestBed.inject(HttpTestingController);
    
    // Trigger lifecycle hooks
    fixture.detectChanges();
    
    // Resolve the branding config HTTP call
    const req = httpMock.expectOne('/config.json');
    req.flush({ logoAccent: 'DEFAULT', logoThin: 'app' });
    
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    httpMock.verify();
  });

  it('should render brand logo', async () => {
    const fixture = TestBed.createComponent(App);
    const httpMock = TestBed.inject(HttpTestingController);
    
    fixture.detectChanges();
    
    const req = httpMock.expectOne('/config.json');
    req.flush({ logoAccent: 'TESTACCENT', logoThin: 'testthin' });
    
    fixture.detectChanges();
    await fixture.whenStable();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-accent')?.textContent).toContain('TESTACCENT');
    expect(compiled.querySelector('.logo-thin')?.textContent).toContain('testthin');
    httpMock.verify();
  });
});
