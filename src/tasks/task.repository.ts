import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { CustomRepository } from 'src/repos/typeorm-ex.decorator';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    //AND WHERE IS PREFEFRED PVER WHERE HERE BECAUSE ANOTHER QUERY CONDITION IS TO BE EXECUTED
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      //LIKE is similar to = , as spaces can be inside query from user also
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `failed to get task for user "${
          user.username
        }", Filters : ${JSON.stringify(filterDto)} `,
        error.stack,
      );

      throw new InternalServerErrorException(' Server Error ' + error);
    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    const { title, description } = createTaskDto;
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `failed to create task for user ${user.username}. Data ${createTaskDto} `,
        error.stack,
      );
      throw new InternalServerErrorException(`Server error "${error}" `);
    }
    delete task.user;

    return task;
  }
}
