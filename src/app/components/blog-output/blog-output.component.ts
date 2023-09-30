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
    this.http.get<any>('api/blog/' + blog.id).subscribe((response) => {
      this.title = response.title;
      this.content = response.content;
    });
  }
}
