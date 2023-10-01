import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { TokenAllocationService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private readonly API_URL = environment.rapidApiUrl

  constructor(
    private http: HttpClient,
    private tokenService: TokenAllocationService
  ) {}

  generateContent(
    apiKey: string,
    fullPrompt: string,
    type: string = '',
    bm: number = 1
  ) {
    if (apiKey) {
      return this.generateContentUsingOpenAI(apiKey, fullPrompt, type, bm);
    } else {
      const headers = {
        'X-RapidAPI-Key': environment.rapidApiKey,
        'X-RapidAPI-Host': environment.rapidApiHost,
      };
      const params = {
        system: 'My AI',
        user: fullPrompt,
      };
      return this.http
        .get(this.API_URL, { headers: headers, params: params })
        .pipe(
          catchError((error) => {
            console.error('Error:', error);
            throw error;
          })
        );
    }
  }

  generateContentUsingOpenAI(
    apiKey: string,
    prompt: string,
    contentType: string,
    baseMultiplier: number = 1
  ) {
    let maxTokens = this.tokenService.calculateTokens(
      contentType,
      baseMultiplier
    );
    if (maxTokens < 20) {
      maxTokens = 20;
    }
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
    const instruction =
      maxTokens > 50 ? prompt : `${prompt} Please provide a concise response.`;
    const body = {
      model: 'gpt-3.5-turbo',
      temperature: maxTokens > 50 ? 0.5 : 0.3, // Lower temperature for shorter token limits
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful professional blog writing helper assistant.',
        },
        {
          role: 'user',
          content:
            instruction +
            ` Note: the max token allocated is ${maxTokens}, so ensure your response fits within ${maxTokens} tokens.`,
        },
      ],
      max_tokens: maxTokens,
    };
    return this.http.post('https://api.openai.com/v1/chat/completions', body, { headers: headers }).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  completeUnfinishedText(unfinishedText: string) {
    return this.generateContent('', `Continue from: "${unfinishedText}"`);
  }
}
