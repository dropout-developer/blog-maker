import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenAllocationService {
  // Define an index signature for tokenConfig
  private tokenConfig: {
    [key: string]: number;
    paragraph: number;
    resources: number;
    title:number;
  } = {
    paragraph: 80,
    resources: 160,
    title: 40
  };

  // Calculate tokens based on the base multiplier
  calculateTokens(type: string, baseMultiplier: number): number {
    if (!this.tokenConfig[type]) {
      throw new Error(`Unknown content type: ${type}`);
    }
    return this.tokenConfig[type] * baseMultiplier;
  }
}
