import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() showActions: boolean = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  onEdit(record: any) {
    this.edit.emit(record);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }
}
