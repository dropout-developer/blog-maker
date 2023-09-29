import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private readonly API_URL =
    'https://api.openai.com/v1/engines/davinci-codex/completions';

  constructor(private http: HttpClient) {}

  getBlogContent(keyword: string, description: string): Observable<any> {
    const data = {
      prompt: `${keyword}\n${description}`,
      max_tokens: 500,
    };

    return this.http.post(this.API_URL, data, {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
