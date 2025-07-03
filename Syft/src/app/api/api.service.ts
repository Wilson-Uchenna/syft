import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { firstValueFrom, Observable } from 'rxjs';

const API_HOST = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  token!: string;

  constructor(private http: HttpClient) {}

  static handleError(error: any): void {
    alert(error.message);
  }

  static extractData(res: HttpEvent<any>): any {
    return res || {};
  }

  setAuthToken(token: string): void {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `jwt ${token}`);
    this.token = token;
  }

  get(endpoint: string): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    const req = this.http.get<any>(url, this.httpOptions).pipe(
      map(ApiService.extractData)
    );

    return firstValueFrom(req).catch((e) => {
      ApiService.handleError(e);
      throw e;
    });
  }

  post(endpoint: string, data: any): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    return firstValueFrom(this.http.post<any>(url, data, this.httpOptions)).catch((e) => {
      ApiService.handleError(e);
      throw e;
    });
  }

  async upload(endpoint: string, file: File, payload: any): Promise<any> {
    const signed_url = (await this.get(`${endpoint}/signed-url/${file.name}`)).url;

    const headers = new HttpHeaders({ 'Content-Type': file.type });
    const req = new HttpRequest('PUT', signed_url, file, {
      headers: headers,
      reportProgress: true
    });

    return new Promise((resolve) => {
      this.http.request(req).subscribe((resp) => {
        if (resp && (resp as any).status === 200) {
          resolve(this.post(endpoint, payload));
        }
      });
    });
  }
}
