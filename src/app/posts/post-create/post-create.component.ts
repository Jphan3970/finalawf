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

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  onAddSteps(){
    this.isAddingStep = true;
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
      content: new FormControl(null, { validators: [Validators.required] }),
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
            content: postData.content,
            ingredients: postData.ingredients,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
          this.imagePreview = this.post.imagePath
          this.ingredientFromParent = JSON.parse(this.post.ingredients)
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
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        JSON.stringify(this.ingredientFromChild)
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        JSON.stringify(this.ingredientFromChild),
        this.form.value.image
      );
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

  stepContent: Array<Ingredient>
  onStepAddedFromChild(stepContentFromChild: Array<Ingredient>){
    this.stepContent = stepContentFromChild;
    // let something = JSON.stringify(this.ingredientFromChild)
  }
}
