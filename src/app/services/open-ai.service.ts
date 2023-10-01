import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { TokenAllocationService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient, private tokenService: TokenAllocationService) {}

  generateContent(apiKey: string, prompt: string, contentType: string, baseMultiplier: number = 1) {
    let maxTokens = this.tokenService.calculateTokens(contentType, baseMultiplier);
    if (maxTokens < 20) {
      maxTokens = 20
    }
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    const instruction = maxTokens > 50 ?
        prompt :
        `${prompt} Please provide a concise response.`;
    const body = {
      model: "gpt-3.5-turbo",
      temperature: maxTokens > 50 ? 0.5 : 0.3,  // Lower temperature for shorter token limits
      messages: [
        {
          role: "system",
          content: "You are a helpful professional blog writing helper assistant."
        },
        {
          role: "user",
          content: instruction + ` Note: the max token allocated is ${maxTokens}, so ensure your response fits within ${maxTokens} tokens.`
        }
      ],
      max_tokens: maxTokens,
    };
    return this.http.post(this.API_URL, body, { headers: headers })
    .pipe(
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
}

completeUnfinishedText(apiKey: string, unfinishedText: string) {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  const body = {
    model: "gpt-3.5-turbo",
    temperature:0.5,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant."
      },
      {
        role: "user",
        content: `Continue from: "${unfinishedText}"`
      }
    ],
  };
  return this.http.post(this.API_URL, body, { headers: headers })
  .pipe(
    catchError(error => {
      console.error('Error:', error);
      throw error;
    })
  );
}

}
