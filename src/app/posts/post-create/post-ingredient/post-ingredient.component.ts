import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ingredient } from '../post.model';

@Component({
  selector: 'app-post-ingredient',
  templateUrl: './post-ingredient.component.html',
  styleUrls: ['./post-ingredient.component.scss']
})
export class PostIngredientComponent implements OnInit {
  nameAutofilled: boolean;
  quantityAutofilled: boolean;
  numberOfIngredient:string[] = ["1"];

  ingredientForm = new FormGroup({
    name : new FormControl(''),
    quantity : new FormControl('')
  });

  @Input() ingredientAdded:  Array<Ingredient> = [];
  @Output() ingredientAddedFromChild: EventEmitter<Array<Ingredient>> = new EventEmitter()


  constructor() { }

  ngOnInit() {
  }

  addMoreIngredient(ingredientForm){
    this.ingredientAdded.push({name: ingredientForm.name, quantity: ingredientForm.quantity})
    this.ingredientAddedFromChild.emit(this.ingredientAdded);

  }
  removeAnIngredient(ingredient){
    this.ingredientAdded = this.ingredientAdded.filter(item => item !== ingredient);
    this.ingredientAddedFromChild.emit(this.ingredientAdded);
  }

}
