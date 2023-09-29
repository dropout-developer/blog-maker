import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogInputComponent } from './blog-input/blog-input.component';
import { BlogOutputComponent } from './blog-output/blog-output.component';

const routes: Routes = [
  { path: 'create-blog', component: BlogInputComponent },
  { path: 'blog-output', component: BlogOutputComponent },
  { path: '', redirectTo: '/create-blog', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
