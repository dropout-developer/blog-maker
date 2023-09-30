import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogInputComponent } from './components/blog-input/blog-input.component';
import { BlogOutputComponent } from './components/blog-output/blog-output.component';

import { TableOfContentComponent } from './components/table-of-content/table-of-content.component';
import { SubcategoryComponent } from './components/subcategory/subcategory.component';

const routes: Routes = [
  { path: 'create-blog', component: BlogInputComponent },
  { path: 'blog-output', component: BlogOutputComponent },
  { path: 'table-of-content', component: TableOfContentComponent },
  { path: 'subcategory', component: SubcategoryComponent },
  { path: '', redirectTo: '/create-blog', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
