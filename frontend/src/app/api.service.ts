import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  SystemMetrics, 
  ApiResponse 
} from 'shared';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';



  getMetrics(): Observable<SystemMetrics> {
    return this.http.get<ApiResponse<SystemMetrics>>(`${this.baseUrl}/metrics`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to fetch metrics');
        }
        return response.data;
      })
    );
  }
}
