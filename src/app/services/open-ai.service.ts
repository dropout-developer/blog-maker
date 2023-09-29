import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private openAIUrl =
    'https://api.openai.com/v1/engines/davinci-codex/completions';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.OPEN_AI_API_KEY}`,
    }),
  };

  constructor(private http: HttpClient) {}

  generateBlog(prompt: string): Observable<any> {
    const body = {
      prompt: prompt,
      max_tokens: 500,
    };

    return this.http.post(this.openAIUrl, body, this.httpOptions);
  }
}
