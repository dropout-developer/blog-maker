import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.css'],
})
export class TableOfContentComponent implements OnInit {
  tableOfContents: string[] = [];

  constructor() {}

  ngOnInit(): void {}

  updateTableOfContents(newTableOfContents: string[]): void {
    this.tableOfContents = newTableOfContents;
  }
}
