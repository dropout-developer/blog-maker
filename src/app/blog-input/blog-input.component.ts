import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-blog-input',
  templateUrl: './blog-input.component.html',
  styleUrls: ['./blog-input.component.scss'],
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
