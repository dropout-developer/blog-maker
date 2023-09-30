import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private readonly API_URL =
    'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  generateContent(prompt: string) {
    const headers = {
      'Authorization': `Bearer ${environment.OPEN_AI_API_KEY}`,
      'Content-Type': 'application/json'
    };
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
    };
    return this.http.post(this.API_URL, body, { headers: headers });
  }

}
