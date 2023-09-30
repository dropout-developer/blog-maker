import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OpenAIService } from 'src/app/open-ai.service';

@Component({
  selector: 'app-blog-input',
  templateUrl: './blog-input.component.html',
  styleUrls: ['./blog-input.component.css'],
})
export class BlogInputComponent implements OnInit {
  blogForm?:FormGroup
  title: string = '';
  content: string[] = [];
  subheadings: string[] = [];
  conclusion: string = '';
  qna: any[] = [];
  resources: string[] = [];
  basePrompt = `
  We are building a comprehensive, SEO-optimized blog post generator. The goal is to produce high-quality, contextually relevant, and engaging content for readers. Each step in the generation process is crucial to ensure the content flows naturally and is optimized for search engines. The current progress will be provided to maintain context. Please provide specific and relevant responses without any extra information.
  `;

  constructor(private openaiService: OpenAIService, private formBuilder:FormBuilder) {}

  ngOnInit(): void {
    this.blogForm = this.formBuilder.group({
      keyword: [''],
      wordCount: ['']
    });

  }

  async onSubmit() {
    const keyword = this.blogForm?.value.keyword as string;
    const wordCount = this.blogForm?.value.wordCount;

    await this.generateTitle(keyword);
    await this.generateOutlineAndContent(keyword);
    await this.generateConclusion(keyword);
    await this.generateQnA(keyword);
    await this.generateResources(keyword);
  }

  generateTitle(keyword: string) {
    const currentProgress = `So far, we have chosen the keyword "${keyword}" to focus our blog post on.`;
    const specificRequest = `Given this, please provide a captivating title for a blog post about ${keyword}. The title should be SEO-optimized and relevant to the keyword.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService.generateContent(fullPrompt)
      .pipe(catchError(error => {
        console.error("Error generating title:", error);
        return [];
      }))
      .subscribe((response: any) => {
        this.title = response.choices[0].message.content.trim();
      });
}
generateOutlineAndContent(keyword: string) {
  const currentProgress = `So far, we have chosen the keyword "${keyword}" and generated a captivating title for our blog post.`;
  const specificRequest = `Now, please outline a comprehensive blog post about ${keyword} with main points and sub-points. Ensure the outline flows logically.`;

  const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

  this.openaiService.generateContent(fullPrompt)
    .pipe(catchError(error => {
      console.error("Error generating outline:", error);
      return [];
    }))
    .subscribe((outlineResponse: any) => {
      this.subheadings = outlineResponse.choices[0].message.content.split('\n').map((item: string) => item.trim());

      const contentRequests = this.subheadings.map(item => this.openaiService.generateContent(`Elaborate on the topic: ${item}`));

      forkJoin(contentRequests).subscribe((contentResponses: any[]) => {
        this.content = contentResponses.map(response => response.choices[0].message.content.trim());
      });
    });
}

generateConclusion(keyword: string) {
  const currentProgress = `So far, we have chosen the keyword "${keyword}", generated a captivating title, and outlined the main points of our blog post.`;
  const specificRequest = `Now, let's conclude the blog post about ${keyword} by summarizing the main points and providing a final thought.`;

  const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

  this.openaiService.generateContent(fullPrompt)
    .pipe(catchError(error => {
      console.error("Error generating conclusion:", error);
      return [];
    }))
    .subscribe((response: any) => {
      this.conclusion = response.choices[0].message.content.trim();
    });
}

generateQnA(keyword: string) {
  const currentProgress = `So far, we have chosen the keyword "${keyword}", generated a captivating title, outlined the main points, and created a conclusion for our blog post.`;
  const specificRequest = `Now, provide a Q&A section related to ${keyword} with relevant questions and detailed answers.`;

  const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

  this.openaiService.generateContent(fullPrompt)
    .pipe(catchError(error => {
      console.error("Error generating Q&A:", error);
      return [];
    }))
    .subscribe((response: any) => {
      this.qna = response.choices[0].message.content.split('\n\n').map((item: string) => {
        const [question, answer] = item.split('\n');
        return { question, answer };
      });
    });
}

generateResources(keyword: string) {
  const currentProgress = `So far, we have chosen the keyword "${keyword}", generated a captivating title, outlined the main points, created a conclusion, and added a Q&A section for our blog post.`;
  const specificRequest = `Finally, list 5 authoritative resources related to ${keyword} with direct links for further reading.`;

  const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

  this.openaiService.generateContent(fullPrompt)
    .pipe(catchError(error => {
      console.error("Error generating resources:", error);
      return [];
    }))
    .subscribe((response: any) => {
      this.resources = response.choices[0].message.content.split('\n');
    });
}

}
