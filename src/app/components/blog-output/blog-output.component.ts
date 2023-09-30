import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-output',
  templateUrl: './blog-output.component.html',
  styleUrls: ['./blog-output.component.css'],
})
export class BlogOutputComponent implements OnInit {
  title: string = '';
  content: string = '';

  constructor() {}

  ngOnInit(): void {}

  updateBlog(blog: { title: string; content: string }): void {
    this.title = blog.title;
    this.content = blog.content;
  }
}
