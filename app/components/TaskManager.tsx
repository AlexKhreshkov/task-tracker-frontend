'use client';

import { useState, useEffect } from 'react';
import { Task, Status, tasksService } from '../services/tasks';
import TaskModal from './TaskModal';
import { formatDate } from '../utils/dateUtils';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await tasksService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const newTask = await tasksService.createTask({
        title: newTaskTitle.trim(),
        text: ''
      });
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(updatedTask);
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTask(null);
  };

  const incompleteTasks = tasks.filter(task => task.status === Status.TODO);
  const completedTasks = tasks.filter(task => task.status === Status.DONE);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Task Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add New Task
        </h2>
        <form onSubmit={handleCreateTask} className="flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter new task title"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCreating}
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim() || isCreating}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* Incomplete Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Incomplete Tasks ({incompleteTasks.length})
        </h3>
        {incompleteTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No incomplete tasks
          </p>
        ) : (
          <div className="space-y-2">
            {incompleteTasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition duration-200"
              >
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                {task.text && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.text}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Created: {formatDate(task.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Completed Tasks ({completedTasks.length})
        </h3>
        {completedTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No completed tasks
          </p>
        ) : (
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition duration-200 opacity-75"
              >
                <h4 className="font-medium text-gray-900 line-through">{task.title}</h4>
                {task.text && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {task.text}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Completed: {formatDate(task.done_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </div>
  );
}
