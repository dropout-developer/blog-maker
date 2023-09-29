import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogInputComponent } from './components/blog-input/blog-input.component';
import { BlogOutputComponent } from './components/blog-output/blog-output.component';

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
