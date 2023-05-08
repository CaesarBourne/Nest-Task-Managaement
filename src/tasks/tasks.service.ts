import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.status.enum';
// import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(TaskRepository)
    // @InjectRepository(Task)
    // private taskRrepository: Repository<Task>,

    private taskRrepository: TaskRepository,
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRrepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRrepository.createTask(createTaskDto, user);

    //without repository
    // const task = new Task();
    // const { title, description } = createTaskDto;
    // task.title = title;
    // task.description = description;
    // task.status = TaskStatus.OPEN;
    // await task.save();
    // return task;
  }

  async deleteTaskById(id: number, user: User): Promise<DeleteResult> {
    const result = await this.taskRrepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    } else {
      return result;
    }
    console.log(result);
    // this.tasks.filter((task) => task.id !== found.id);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRrepository.getTasks(filterDto, user);
  }
}

//before databse
// private tasks: Task[] = [];
// getAllTasks(): Task[] {
//   return this.tasks;
// }
// getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
//   const { status, search } = filterDto;
//   let tasks = this.getAllTasks();
//   if (status) {
//     tasks = tasks.filter((task) => task.status === status);
//   }
//   if (search) {
//     tasks = tasks.filter(
//       (task) =>
//         task.title.includes(search) || task.description.includes(search),
//     );
//   }
//   return tasks;
// }
// getTaskById(id: string) {
//   const found = this.tasks.find((task) => task.id === id);
//   if (!found) {
//     throw new NotFoundException(`Task with ID ${id} not found`);
//   }
//   return found;
// }
// deleteTaskById(id: string) {
//   const found = this.getTaskById(id);
//   this.tasks.filter((task) => task.id !== found.id);
// }
// updateTaskStatus(id: string, status: TaskStatus) {
//   const task = this.getTaskById(id);
//   task.status = status;
//   return task;
//   // for (const task of this.tasks) {
//   //   if (task.id === id) {
//   //     task.status = status;
//   //     return task;
//   //   }
//   // }
// }
// createTask(createTaskDto: CreateTaskDto) {
//   const { title, description } = createTaskDto;
//   const task: Task = {
//     title,
//     description,
//     status: TaskStatus.OPEN,
//     id: uuid(),
//   };
//   this.tasks.push(task);
//   return task;
// }
