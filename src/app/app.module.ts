import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogInputComponent } from './components/blog-input/blog-input.component';
import { BlogOutputComponent } from './components/blog-output/blog-output.component';
import { TableOfContentComponent } from './components/table-of-content/table-of-content.component';
import { SubcategoryComponent } from './components/subcategory/subcategory.component';
import { OpenAIService } from './services/open-ai.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BlogInputComponent,
    BlogOutputComponent,
    TableOfContentComponent,
    SubcategoryComponent,
  ],
  imports: [BrowserModule, AppRoutingModule,ReactiveFormsModule,HttpClientModule,
    FormsModule],
  providers: [OpenAIService],
  bootstrap: [AppComponent],
})
export class AppModule {}
