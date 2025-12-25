'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Task, Status, tasksService } from '../services/tasks';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

export default function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  onTaskUpdate, 
  onTaskDelete 
}: TaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.text);
  const [completed, setCompleted] = useState(task.status === Status.DONE);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset form when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.text);
    setCompleted(task.status === Status.DONE);
    setHasChanges(false);
  }, [task]);

  // Check for changes
  useEffect(() => {
    const titleChanged = title.trim() !== task.title;
    const descriptionChanged = description !== task.text;
    const completedChanged = completed !== (task.status === Status.DONE);
    setHasChanges(titleChanged || descriptionChanged || completedChanged);
  }, [title, description, completed, task]);

  const handleSave = async () => {
    if (isUpdating || !hasChanges) return;
    
    setIsUpdating(true);
    try {
      // Always send all fields for PUT request
      const updates = {
        title: title.trim(),
        text: description,
        status: completed ? Status.DONE : Status.TODO
      };

      const updatedTask = await tasksService.updateTask(task.id, updates);
      onTaskUpdate(updatedTask);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
      // Revert changes on error
      setTitle(task.title);
      setDescription(task.text);
      setCompleted(task.status === Status.DONE);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
  };

  const handleCompletedChange = (newCompleted: boolean) => {
    setCompleted(newCompleted);
  };

  const handleDelete = async () => {
    if (isDeleting || !confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await tasksService.deleteTask(task.id);
      onTaskDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            disabled={isUpdating}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter task description"
            disabled={isUpdating}
          />
        </div>

        {/* Completed Checkbox */}
        <div className="flex items-center">
          <input
            id="task-completed"
            type="checkbox"
            checked={completed}
            onChange={(e) => handleCompletedChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isUpdating}
          />
          <label htmlFor="task-completed" className="ml-2 block text-sm text-gray-700">
            Task completed
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || isUpdating || isDeleting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Loading indicator */}
        {isUpdating && (
          <div className="text-sm text-gray-500 text-center mt-2">
            Saving changes...
          </div>
        )}
      </div>
    </Modal>
  );
}
