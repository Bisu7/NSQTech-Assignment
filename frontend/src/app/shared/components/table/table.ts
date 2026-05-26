import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  standalone: false
})
export class Table {
  @Input() records: any[] = [];
  @Input() columns: string[] = ['Title', 'Description', 'Access Level', 'Assigned User'];
  @Input() isLoading: boolean = false;
}
