import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css'],
})
export class SubcategoryComponent implements OnInit {
  title: string = '';
  content: string = '';

  constructor() {}

  ngOnInit(): void {}

  updateSubcategory(subcategory: { title: string; content: string }): void {
    this.title = subcategory.title;
    this.content = subcategory.content;
  }
}
