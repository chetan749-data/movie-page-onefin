import { Component } from '@angular/core';
// import { Authenticatiervice } from './services/authentication.service';
import { AuthenticationService } from './service/authentication/authentication.service'
import { AppModule } from './app.module';
import { HomeComponent } from './home/home.component';
@Component({
  providers:[HomeComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Movie-page';

  constructor(public authenticationService: AuthenticationService) { }

  logout() {
    this.authenticationService.logout();
  }
}