import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/todos';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GET /todos
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  // GET /todos/:id
  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  // POST /todos
  createTask(task: TaskCreateRequest): Observable<Task> {
    return this.http.post<Task>(this.API_URL, task);
  }

  // PUT /todos/:id
  updateTask(id: number, task: TaskUpdateRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task);
  }

  // DELETE /todos/:id
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // Update local tasks state
  updateTasksState(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }

  // Get current tasks value
  getCurrentTasks(): Task[] {
    return this.tasksSubject.value;
  }
}