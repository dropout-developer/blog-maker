import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogInputComponent } from './components/blog-input/blog-input.component';

const routes: Routes = [
  { path: '', component: BlogInputComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
