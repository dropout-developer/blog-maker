import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BlogInputComponent } from './blog-input/blog-input.component';
import { BlogOutputComponent } from './blog-output/blog-output.component';
import { TableOfContentComponent } from './table-of-content/table-of-content.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';

import { OpenAIService } from './open-ai.service';

const routes: Routes = [
  { path: 'create-blog', component: BlogInputComponent },
  { path: 'blog-output', component: BlogOutputComponent },
  { path: '', redirectTo: '/create-blog', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    BlogInputComponent,
    BlogOutputComponent,
    TableOfContentComponent,
    SubcategoryComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [OpenAIService],
  bootstrap: [AppComponent],
})
export class AppModule {}
