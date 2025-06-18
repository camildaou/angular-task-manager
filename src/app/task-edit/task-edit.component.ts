import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;
  isSubmitting = false;
  loading = true;
  taskId: number;
  task: Task | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      completed: [false]
    });
    
    this.taskId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadTask();
  }

  loadTask(): void {
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.taskForm.patchValue({
          title: task.title,
          completed: task.completed
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.router.navigate(['/']);
      }
    });
  }

  get title() {
    return this.taskForm.get('title');
  }

  onSubmit(): void {
    if (this.taskForm.valid && this.task) {
      this.isSubmitting = true;
      
      const taskData = {
        id: this.task.id,
        title: this.taskForm.value.title.trim(),
        completed: this.taskForm.value.completed,
        userId: this.task.userId
      };

      this.taskService.updateTask(this.task.id, taskData).subscribe({
        next: (updatedTask) => {
          // Update local tasks state
          const currentTasks = this.taskService.getCurrentTasks();
          const updatedTasks = currentTasks.map(t => 
            t.id === this.task!.id ? { ...t, ...taskData } : t
          );
          this.taskService.updateTasksState(updatedTasks);
          
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}