import { Subcategory } from './subcategory';

export class Blog {
  title: string;
  content: string;
  subcategories: Subcategory[];

  constructor(title: string, content: string, subcategories: Subcategory[]) {
    this.title = title;
    this.content = content;
    this.subcategories = subcategories;
  }
}
