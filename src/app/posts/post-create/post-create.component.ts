import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { Ingredient } from "./post.model";
import { RecipeStep } from "./recipeSteps.model";
import { MatCheckboxChange } from "@angular/material";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  isAddIngredients: boolean  = false;
  isAddingStep:boolean = false;
  ingredientFromParent: Array<Ingredient> = [];
  stepContentFromParent: Array<RecipeStep> = [];
  isItPrivate: string = "true";

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  onAddSteps(){
    this.isAddingStep = true;
  }


  isItPrivateHandler(event : MatCheckboxChange){
    this.isItPrivate = event.checked.toString()
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            ingredients: postData.ingredients,
            stepContent: postData.stepContent,
            imagePath: postData.imagePath,
            creator: postData.creator,
            isItPrivate: postData.isItPrivate
          };
          this.form.setValue({
            title: this.post.title,
            image: this.post.imagePath
          });
          this.imagePreview = this.post.imagePath
          this.ingredientFromParent = JSON.parse(this.post.ingredients)
          this.stepContentFromParent = JSON.parse(this.post.stepContent)
          this.isAddingStep = true;
          this.isAddIngredients = true;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddIngredient(){
    this.isAddIngredients = true
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    if(this.ingredientFromParent == undefined || this.stepContentFromParent == undefined){
      alert("A recipe should have ingredient and some step content")
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      if(this.ingredientFromChild == undefined || this.stepContent == undefined){
        alert("A recipe should have ingredient and some step content")
        this.isLoading = false
        return;
      }
      else{
        this.postsService.addPost(
          this.form.value.title,
          this.form.value.image,
          JSON.stringify(this.ingredientFromChild),
          JSON.stringify(this.stepContent),
          this.isItPrivate
        );
      }

    } else {
      if(this.ingredientFromParent == undefined || this.stepContentFromParent == undefined){
        alert("A recipe should have ingredient and some step content")
        this.isLoading = false
        return;
      }
      else{
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        JSON.stringify(this.ingredientFromChild),
        JSON.stringify(this.stepContent),
        this.form.value.image,
        this.isItPrivate
      );
      }

    }
    this.form.reset();
  }


  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  ingredientFromChild: Array<Ingredient>
  onIngredientAddedFromChild(ingredientFromChild: Array<Ingredient>){
    this.ingredientFromChild = ingredientFromChild;
    // let something = JSON.stringify(this.ingredientFromChild)
  }

  stepContent: Array<RecipeStep>
  onStepAddedFromChild(stepContentFromChild: Array<RecipeStep>){
    this.stepContent = stepContentFromChild;
    // let something = JSON.stringify(this.ingredientFromChild)
  }
}
