import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {
  private readonly API_URL =
    'https://api.openai.com/v1/engines/davinci-codex/completions';

  constructor(private http: HttpClient) {}

  generateBlogPost(keyword: string): Observable<BlogPost> {
    const body = {
      prompt: keyword,
      max_tokens: 500,
    };

    return this.http.post<BlogPost>(this.API_URL, body);
  }
}
