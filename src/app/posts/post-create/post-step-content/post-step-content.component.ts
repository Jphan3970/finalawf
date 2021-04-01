import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RecipeStep } from '../recipeSteps.model';

@Component({
  selector: 'app-post-step-content',
  templateUrl: './post-step-content.component.html',
  styleUrls: ['./post-step-content.component.scss']
})
export class PostStepContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  stepContentForm = new FormGroup({
    content : new FormControl('')
  });
  editStepContentForm = new FormGroup({
    content: new FormControl('')
  })

  @Input() recipeStep:  Array<RecipeStep> = [];
  @Output() recipeStepFromChild: EventEmitter<Array<RecipeStep>> = new EventEmitter()


  onAddStepButtonClick(form){
    if(form.content === ''){
      alert("You need to add content!")
    }
    else{
      this.recipeStep.push({stepNo:this.recipeStep.length + 1,content:form.content})
      this.stepContentForm.reset()
      this.recipeStepFromChild.emit(this.recipeStep)
    }

  }
  onRemoveStep(recipeStepToBeRemoved){
    const index: number = this.recipeStep.indexOf(recipeStepToBeRemoved);
    if(index !== -1){
      this.recipeStep.splice(index, 1);
      for(let i = 0 ; i < this.recipeStep.length; i++){
        if(this.recipeStep[i].stepNo - 1 != i){
          this.recipeStep[i].stepNo = i + 1
        }
      }
      this.recipeStepFromChild.emit(this.recipeStep)
    }

  }

  isSaving:boolean = false;
  isEdditing:boolean = false;

  onEditStep(){
    this.isEdditing = true;
    this.isSaving = true;
  }
  onSaveStep(stepNo, newContent){
    for(let i = 0 ; i < this.recipeStep.length; i++){
      if(this.recipeStep[i].stepNo == stepNo){
        this.recipeStep[i].content = newContent.content;
      }
    }
    this.isSaving = false;
    this.isEdditing = true;
    this.recipeStepFromChild.emit(this.recipeStep)
  }

}
