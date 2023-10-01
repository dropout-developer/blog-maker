import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { throwError } from 'rxjs';
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
  delayCount = 600
  basePrompt = `
  Generate engaging and relevant content based on the given progress and request. Do not include any additional information, commentary, or introductory phrases in the response.
  `;
  customApiKey = false;
  blogCount: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  power = 1.5;

  constructor(
    private openaiService: OpenAIService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.blogCount = Number(localStorage.getItem('blogCount')) || 0;
    this.blogForm = this.formBuilder.group({
      keyword: ['', Validators.required],
      apiKey: [''],
    });

    // Subscribe to form value changes
    this.blogForm.valueChanges.subscribe(() => {
      this.clearErrorMessage();
    });
  }

  clearErrorMessage(): void {
    if (this.blogForm?.valid) {
      this.errorMessage = '';
    }
  }

  async onSubmit() {
    this.blogCount++;
    localStorage.setItem('blogCount', this.blogCount.toString());
    if (this.blogCount > 3) {
      this.errorMessage = 'Blog limit reached. Please email the admin for more access.';
      this.cdRef.detectChanges();
      return;
    }
    if (this.blogForm?.invalid) {
        this.errorMessage = 'All fields are required!';
        this.cdRef.detectChanges();
        return;
    }
    this.isLoading = true;
    this.cdRef.detectChanges();

    const keyword = this.blogForm?.value.keyword as string;
    try {
      await this.generateTitle(keyword);
      await this.delay(this.delayCount);
      await this.delay(this.delayCount);
      await this.generateOutlineAndContent(keyword);
      await this.delay(this.delayCount);
      await this.generateConclusion(keyword);
      await this.delay(this.delayCount);
      await this.generateQnA(keyword);
      await this.delay(this.delayCount);
      await this.generateResources(keyword);
    } catch (error: any) {
      this.errorMessage = 'An error occurred while generating the blog content: ' + error.message;
      this.cdRef.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  handleErrors(error: any) {
    console.error('Error:', error);
    this.errorMessage = 'An error occurred. Please check the console for more details.';
    this.isLoading = false;
    this.cdRef.detectChanges();
    return throwError(error);  // Ensure this line is present to return an observable
  }

  generateTitle(keyword: string) {
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Generate a concise, SEO-optimized title for a blog post about ${keyword}, considering its relevance in today's digital landscape. Ensure it's engaging to readers. Note - This call is made by an API to add title in the title field, please make sure to output title only.`;
    const apiKey = this.blogForm?.value.apiKey as string;
    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(apiKey, fullPrompt, 'title', this.power)
      .pipe(
        catchError((error) => this.handleErrors(error))
      )
      .subscribe((response: any) => {
        this.blogData.title = response.choices[0].message.content.trim();
        this.cdRef.detectChanges();
      });
  }

  handleIncompleteResponse(responseText: string): string {
    // Split the text into sentences
    const sentences = responseText.match(/[^.!?]+[.!?]/g) || [];

    // If the last sentence doesn't end with a punctuation mark, remove it
    if (sentences.length > 0 && !/[.!?]$/.test(sentences[sentences.length - 1])) {
      sentences.pop();
    }

    // Join the remaining sentences back together
    return sentences.join(' ').trim();
  }


  async generateOutlineAndContent(keyword: string) {
    const apiKey = this.blogForm?.value.apiKey as string;
    const currentProgress = `Keyword: "${keyword}", Title: "${this.blogData.title}".`;
    const specificRequest = `Based on the title "${this.blogData.title}", provide a logical and engaging outline with 6 headings only including a heading for introduction of topic too ( skip subheadings for now and do not include in response, we need only 5 headings and no subheadings) for a blog post about ${keyword},
    focusing on its relevance in today's digital landscape (Don't start with in todays digital age, start naturally like example - moving into next topic, next, let's talk about etc). `
    // Include main points and sub-points, excluding the title and introduction. Provide specific examples where necessary.
    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    try {
      const outlineResponse: any = await this.openaiService
      .generateContent(apiKey, fullPrompt, 'paragraph', this.power)
      .toPromise();

      this.blogData.subheadings = outlineResponse.choices[0].message.content
        .split('\n')
        .map((item: string) => item.trim());

      for (let item of this.blogData.subheadings) {
        await this.delay(this.delayCount);  // Delay of this.delayCount milliseconds to ensure a rate of 1-3 requests per second
        const contentResponse: any = await this.generateContentRequest(apiKey, item).toPromise();
        const content = this.handleIncompleteResponse(contentResponse.choices[0].message.content.trim());
        this.blogData.content.push(content);
      }
    } catch (error) {
      console.error('Error generating outline:', error);
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  generateContentRequest(apiKey: string, item: string) {
    let prompt = `Elaborate on the subheading "${item}" for the blog post about ${this.blogForm?.value.keyword}, considering the title "${this.blogData.title}". Provide a detailed and relevant paragraph that directly addresses the subheading. Do not include a title for this section.`;

    if (item.toLowerCase().trim() === 'i. introduction' || item.toLowerCase().trim() === 'introduction') {
      prompt = `Considering the focus keyword "${this.blogForm?.value.keyword}" and the title "${this.blogData.title}", please provide a detailed and relevant introduction paragraph for the blog.`;
    }

    return this.openaiService.generateContent(
      apiKey,
      prompt,
      'paragraph',
      this.power
    );
}


  generateConclusion(keyword: string) {
    const apiKey = this.blogForm?.value.apiKey as string;
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Summarize the main points and provide a final thought for a blog post about ${keyword}. Do not include any additional information or introductory phrases.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(apiKey, fullPrompt, 'paragraph', this.power)
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
    const apiKey = this.blogForm?.value.apiKey as string;
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `Provide a Q&A section related to ${keyword} with relevant questions and detailed answers. Format each entry as: Question: [question text] Answer: [answer text].`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(apiKey, fullPrompt, 'resources', this.power)
      .pipe(
        catchError((error) => {
          console.error('Error generating Q&A:', error);
          return [];
        })
      )
      .subscribe((response: any) => {
        this.blogData.qna = response.choices[0].message.content
          .split('\n\n')
          .map((item: string) => {
            const [question, answer] = item.split('\n');
            return { question, answer } as QnA;
          });
      });
  }

  generateResources(keyword: string) {
    const apiKey = this.blogForm?.value.apiKey as string;
    const currentProgress = `Keyword: "${keyword}".`;
    const specificRequest = `List 5 authoritative resources related to ${keyword} along with a brief description and direct link for each. Ensure the resources are up-to-date and relevant.`;

    const fullPrompt = `${this.basePrompt} ${currentProgress} ${specificRequest}`;

    this.openaiService
      .generateContent(apiKey, fullPrompt, 'resources', this.power)
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
      this.blogData.qna.forEach((qa) => {
        blogContent += `${qa.question}\n${qa.answer}\n\n`;
      });
    }
    if (this.blogData.resources.length) {
      blogContent += `Resources\n`;
      this.blogData.resources.forEach((resource) => {
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
      this.blogData.qna.forEach((qa) => {
        blogContent += `${qa.question}\n${qa.answer}\n\n`;
      });
    }
    if (this.blogData.resources.length) {
      blogContent += `Resources\n`;
      this.blogData.resources.forEach((resource) => {
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
