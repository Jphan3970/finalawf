import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { PostIngredientComponent } from "./post-create/post-ingredient/post-ingredient.component";
import { MatDividerModule, MatTableModule } from '@angular/material'
import { PostStepContentComponent } from "./post-create/post-step-content/post-step-content.component";

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, PostIngredientComponent,PostStepContentComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatTableModule,
    FormsModule,
    MatDividerModule
  ],
  exports:[ MatTableModule ]
})
export class PostsModule {}
