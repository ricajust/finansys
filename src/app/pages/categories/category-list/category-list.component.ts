import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      (categories) => this.categories = categories,
      (error) => alert('Erro ao carregar lista!')
    );
  }

  public deleteCategory(category): void {
    const mustDelete = confirm("Deseja realmente excluir esse item?")
    if(mustDelete){
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(elem => elem != category),
        (error) => console.log("Erro ao tentar excluir", error)
      );
    }
  }

}
