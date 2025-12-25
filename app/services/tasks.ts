const API_BASE_URL = 'http://localhost:8080/api';
const TASKS_URL = API_BASE_URL + '/tasks';

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Task {
  id: number;
  title: string;
  text: string;
  status: Status;
  user_id: number;
  created_at: string;
  done_at: string | null;
}

export interface CreateTaskRequest {
  title: string;
  text?: string;
}

export interface UpdateTaskRequest {
  title: string;
  text: string;
  status: Status;
}

class TasksService {
  private getRequestOptions(): RequestInit {
    return {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async getTasks(): Promise<Task[]> {
    const response = await fetch(TASKS_URL, {
      method: 'GET',
      ...this.getRequestOptions(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return response.json();
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await fetch(TASKS_URL, {
      method: 'POST',
      ...this.getRequestOptions(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create task');
    }

    return response.json();
  }

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await fetch(`${TASKS_URL}/${id}`, {
      method: 'PUT',
      ...this.getRequestOptions(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update task');
    }

    return response.json();
  }

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${TASKS_URL}/${id}`, {
      method: 'DELETE',
      ...this.getRequestOptions(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete task');
    }
  }
}

export const tasksService = new TasksService();
