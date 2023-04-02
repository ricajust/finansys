import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  public categoryForm: FormGroup;
  public currentAction: string = '';
  public pageTitle: string = '';
  public serverErrorMessages: string[] = null;
  public submittingForm:boolean = false;
  public category:Category = new Category();

  constructor(
    private categoryService:CategoryService,
    private route:ActivatedRoute,
    private router:Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }


  public ngAfterContentChecked(): void {
    this.setPageTitle();
  }


  private setCurrentAction():void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm():void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory():void {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id'))) //+ cast to transform result in number
      )
      .subscribe(
        category => {
          this.category = category;
          this.categoryForm.patchValue(category); //binds loaded category data to CategoryForm
        },
        (error) => console.log('Ocorreu um erro no servidor, tente mais tarde: ', error)
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de nova categoria'
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando categoria: ${categoryName}`
    }
  }


}
