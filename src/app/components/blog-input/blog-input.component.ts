import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BlogData, QnA } from 'src/app/models/blog';
import { OpenAIService } from 'src/app/services/open-ai.service';

@Component({
  selector: 'app-blog-input',
  templateUrl: './blog-input.component.html',
  styleUrls: ['./blog-input.component.css'],
})
export class BlogInputComponent implements OnInit {
  blogForm?: FormGroup;
  blogData: BlogData = {
    title: '',
    content: [],
    subheadings: [],
    conclusion: '',
    qna: [],
    resources: [],
  };

  basePrompt = `
  Generate concise and specific content based on the given progress and request. Do not include any additional information, commentary, or introductory phrases in the response.
`;

  isLoading: boolean = false;
  errorMessage: string = '';

  power = 0.3

  constructor(
    private openaiService: OpenAIService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private el: ElementRef,
    private renderer:Renderer2
  ) {}

  ngOnInit(): void {
    this.blogForm = this.formBuilder.group({
      keyword: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.blogForm?.invalid) {
      this.errorMessage = "Keyword cannot be empty!";
      return;
    }

    this.isLoading = true;
    this.cdRef.detectChanges();
    const keyword = this.blogForm?.value.keyword as string;
    try {
      await this.generateTitle(keyword);
      await this.generateOutlineAndContent(keyword);
      await this.generateConclusion(keyword);
      await this.generateQnA(keyword);
      await this.generateResources(keyword);
    } catch (error) {
      this.errorMessage = "An error occurred while generating the blog content.";
    } finally {
      this.isLoading = false;
    }
  }

  generateTitle(keyword: string) {
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Generate a concise, SEO-optimized title for a blog post about ${keyword}. Do not include any additional information or introductory phrases.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(fullPrompt, 'title', this.power)
      .pipe(
        catchError((error) => {
          console.error('Error generating title:', error);
          return [];
        })
      )
      .subscribe((response: any) => {
        this.blogData.title = response.choices[0].message.content.trim();
      });
  }
  generateOutlineAndContent(keyword: string) {
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Provide a logical outline for a blog post about ${keyword} with main points and sub-points. Do not include any additional information or introductory phrases.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(fullPrompt, 'paragraph', this.power)
      .pipe(
        catchError((error) => {
          console.error('Error generating outline:', error);
          return [];
        })
      )
      .subscribe((outlineResponse: any) => {
        this.blogData.subheadings = outlineResponse.choices[0].message.content
          .split('\n')
          .map((item: string) => item.trim());

        const contentRequests = this.blogData.subheadings.map((item) =>
          this.openaiService.generateContent(`Elaborate on the topic: ${item}`, 'paragraph', this.power)
        );

        forkJoin(contentRequests).subscribe((contentResponses: any[]) => {
          this.blogData.content = contentResponses.map((response) =>
            response.choices[0].message.content.trim()
          );
        });
      });
  }

  generateConclusion(keyword: string) {
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Summarize the main points and provide a final thought for a blog post about ${keyword}. Do not include any additional information or introductory phrases.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(fullPrompt, 'paragraph', this.power)
      .pipe(
        catchError((error) => {
          console.error('Error generating conclusion:', error);
          return [];
        })
      )
      .subscribe((response: any) => {
        this.blogData.conclusion = response.choices[0].message.content.trim();
      });
  }

  generateQnA(keyword: string) {
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Provide a Q&A section related to ${keyword} with relevant questions and detailed answers. Do not include any additional information or introductory phrases.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(fullPrompt, 'resources', this.power)
      .pipe(
        catchError((error) => {
          console.error('Error generating Q&A:', error);
          return [];
        })
      )
      .subscribe((response: any) => {
        this.blogData.qna = response.choices[0].message.content.split('\n\n').map((item: string) => {
          const [question, answer] = item.split('\n');
          return { question, answer } as QnA;
        });
      });
  }

  generateResources(keyword: string) {
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `List 5 authoritative resources related to ${keyword} with direct links. Do not include any additional information or introductory phrases.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(fullPrompt, 'resources', this.power)
      .pipe(
        catchError((error) => {
          console.error('Error generating resources:', error);
          return [];
        })
      )
      .subscribe((response: any) => {
        this.blogData.resources =
          response.choices[0].message.content.split('\n');
      });
  }

  exportBlog() {
    let blogContent = `${this.blogData.title}\n\n`;
    this.blogData.subheadings.forEach((subheading, index) => {
        blogContent += `${subheading}\n${this.blogData.content[index]}\n\n`;
    });
    if (this.blogData.conclusion) {
        blogContent += `Conclusion\n${this.blogData.conclusion}\n\n`;
    }
    if (this.blogData.qna.length) {
        blogContent += `Q&A\n`;
        this.blogData.qna.forEach(qa => {
            blogContent += `${qa.question}\n${qa.answer}\n\n`;
        });
    }
    if (this.blogData.resources.length) {
        blogContent += `Resources\n`;
        this.blogData.resources.forEach(resource => {
            blogContent += `${resource}\n`;
        });
    }

    const blob = new Blob([blogContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

copyToClipboard() {
    let blogContent = `${this.blogData.title}\n\n`;
    this.blogData.subheadings.forEach((subheading, index) => {
        blogContent += `${subheading}\n${this.blogData.content[index]}\n\n`;
    });
    if (this.blogData.conclusion) {
        blogContent += `Conclusion\n${this.blogData.conclusion}\n\n`;
    }
    if (this.blogData.qna.length) {
        blogContent += `Q&A\n`;
        this.blogData.qna.forEach(qa => {
            blogContent += `${qa.question}\n${qa.answer}\n\n`;
        });
    }
    if (this.blogData.resources.length) {
        blogContent += `Resources\n`;
        this.blogData.resources.forEach(resource => {
            blogContent += `${resource}\n`;
        });
    }

    const tempElem = document.createElement('textarea');
    tempElem.value = blogContent;
    document.body.appendChild(tempElem);
    tempElem.select();
    document.execCommand('copy');
    document.body.removeChild(tempElem);

    alert('Blog copied to clipboard!');
}


}
