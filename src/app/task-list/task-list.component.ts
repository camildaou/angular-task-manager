import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  Math = Math;
  filteredTasks: Task[] = [];
  loading = true;
  searchControl = new FormControl('');
  
  // Pagination
  currentPage = 1;
  tasksPerPage = 10;
  totalPages = 0;
  
  // Delete confirmation
  showDeleteConfirm = false;
  taskToDelete: Task | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.setupSearch();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.updatePagination();
        this.taskService.updateTasksState(tasks);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filterTasks(searchTerm || '');
      });
  }

  filterTasks(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTasks.length / this.tasksPerPage);
  }

  get paginatedTasks(): Task[] {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;
    return this.filteredTasks.slice(startIndex, endIndex);
  }

  get completedTasksCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get pendingTasksCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  toggleTaskComplete(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        // Update local state
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.filterTasks(this.searchControl.value || '');
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  editTask(task: Task): void {
    this.router.navigate(['/edit', task.id]);
  }

  confirmDelete(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirmed(): void {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete!.id);
          this.filterTasks(this.searchControl.value || '');
          this.closeDeleteConfirm();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.closeDeleteConfirm();
        }
      });
    }
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.taskToDelete = null;
  }

  addTask(): void {
    this.router.navigate(['/add']);
  }
}