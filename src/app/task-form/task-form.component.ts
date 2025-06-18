import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      completed: [false]
    });
  }

  ngOnInit(): void {}

  get title() {
    return this.taskForm.get('title');
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true;
      
      const taskData = {
        title: this.taskForm.value.title.trim(),
        completed: this.taskForm.value.completed,
        userId: 1
      };

      this.taskService.createTask(taskData).subscribe({
        next: (newTask) => {
          // Update local tasks state
          const currentTasks = this.taskService.getCurrentTasks();
          const updatedTasks = [{ ...newTask, id: Date.now() }, ...currentTasks];
          this.taskService.updateTasksState(updatedTasks);
          
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}