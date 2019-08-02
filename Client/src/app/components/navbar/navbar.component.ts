import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RecipesService } from 'src/app/core/services/recipes.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() public readonly loggedIn: boolean;
  @Input() public readonly username: string;
  @Output() public toggle = new EventEmitter();
  @Output() public toggleLogout = new EventEmitter();

  constructor(
    private readonly recipeService: RecipesService,
  ) { }

  ngOnInit() {
  }

  public toggleMenu(): void {
    this.toggle.emit();
  }

  public triggerLogout() {
    this.toggleLogout.emit();
  }

  public resetForm() {
    this.recipeService.selectedRecipeSubject$.next(null);
  }

}
