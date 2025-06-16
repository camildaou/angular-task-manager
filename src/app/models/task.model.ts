export interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface TaskCreateRequest {
  title: string;
  completed: boolean;
  userId: number;
}

export interface TaskUpdateRequest {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}