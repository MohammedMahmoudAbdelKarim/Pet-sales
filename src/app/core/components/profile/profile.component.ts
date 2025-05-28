import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@app/core/auth/auth.service';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-profile',
  imports: [MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile!: User;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user: any) => {
        this.profile = user;
      },
    });
  }
}
