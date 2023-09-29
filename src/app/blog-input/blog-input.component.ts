import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-blog-input',
  template: './blog-input.component.html',
  styleUrls: [],
})
export class BlogInputComponent {
  keyword = '';
  description = '';

  @Output() submitEvent = new EventEmitter<{
    keyword: string;
    description: string;
  }>();

  submit() {
    this.submitEvent.emit({
      keyword: this.keyword,
      description: this.description,
    });
  }
}
