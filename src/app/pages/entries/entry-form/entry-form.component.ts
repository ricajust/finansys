import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toaster from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  public entryForm: FormGroup;
  public currentAction: string = '';
  public pageTitle: string = '';
  public serverErrorMessages: string[] = null;
  public submittingForm:boolean = false;
  public entry:Entry = new Entry();

  constructor(
    private entryService:EntryService,
    private route:ActivatedRoute,
    private router:Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }


  public ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  public submitForm():void {
    this.submittingForm = true;
    if (this.currentAction == "new") {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private setCurrentAction():void {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm():void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry():void {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id'))) //+ cast to transform result in number
      )
      .subscribe(
        entry => {
          this.entry = entry;
          this.entryForm.patchValue(entry); //binds loaded entry data to EntryForm
        },
        (error) => console.log('Ocorreu um erro no servidor, tente mais tarde: ', error)
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de novo lançamento'
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editando lançamento: ${entryName}`
    }
  }

  private createEntry():void {
    const entry: Entry = Object.assign((new Entry), this.entryForm.value); //create a new object with forms data

    this.entryService.create(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionsForError(error)
    )
  }

  private updateEntry():void {
    const entry: Entry = Object.assign((new Entry), this.entryForm.value); //create a new object with forms data

    this.entryService.update(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionsForError(error)
    )
  }

  private actionsForSuccess(entry: Entry):void {
    toaster.success("Solicitação processada com sucesso!");
    //Redirect/Reload component page
    this.router
      .navigateByUrl("entries", {skipLocationChange: true}).then(
        () => this.router.navigate(["entries", entry.id, "edit"])
      );
  }

  private actionsForError(error:any):void {
    toaster.error("Ocorreu um erro ao processar a sua solicitação :(");
    this.submittingForm = false;
    if (error.status == 422) { //422: resource error process
      this.serverErrorMessages = JSON.parse(error._body).errors; // to backend in Rails. Example return ["Nome já existe", "E-mail já cadastrado"]
    } else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde"]; //default message
    }
  }


}
