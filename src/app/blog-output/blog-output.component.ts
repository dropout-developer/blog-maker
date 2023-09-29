import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-output',
  templateUrl: './blog-output.component.html',
  styleUrls: ['./blog-output.component.scss'],
})
export class BlogOutputComponent implements OnInit {
  blogContent: string;

  constructor() {}

  ngOnInit(): void {}
}
