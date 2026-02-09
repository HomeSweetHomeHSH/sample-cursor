package com.example.todo.service;

import com.example.todo.dto.TaskRequest;
import com.example.todo.entity.Category;
import com.example.todo.entity.Task;
import com.example.todo.repository.CategoryRepository;
import com.example.todo.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;

    public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Task> findAll(String keyword, String sortBy) {
        List<Task> tasks;
        if (keyword != null && !keyword.isBlank()) {
            tasks = taskRepository.search(keyword);
        } else {
            tasks = taskRepository.findAll();
        }

        if ("priority".equalsIgnoreCase(sortBy)) {
            tasks.sort(Comparator.comparingInt(t -> t.getPriority().ordinal()));
        }
        return tasks;
    }

    public Task create(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setPriority(request.getPriority());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            task.setCategory(category);
        }
        return taskRepository.save(task);
    }

    public Task toggleCompleted(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
