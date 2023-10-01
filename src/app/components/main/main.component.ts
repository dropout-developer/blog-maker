import { Component } from '@angular/core';
import { OpenAIService } from '../../services/open-ai.service';
import { BlogPost } from '../../models/blog-post.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  keywordControl = new FormControl();
  blogPost: BlogPost;

  constructor(private openAIService: OpenAIService) {}

  generateBlogPost() {
    const keyword = this.keywordControl.value;
    this.openAIService
      .generateBlogPost(keyword)
      .subscribe((blogPost: BlogPost) => {
        this.blogPost = blogPost;
      });
  }
}
