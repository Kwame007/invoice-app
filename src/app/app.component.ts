import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderNavComponent } from "./header/header-nav/header-nav.component";
import { SideBarComponent } from "./header/side-bar/side-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderNavComponent, SideBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'invoice-app';
}
