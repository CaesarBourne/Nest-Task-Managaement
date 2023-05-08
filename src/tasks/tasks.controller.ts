import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';
// import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User   "${
        user.username
      }" retrieving all tasks. Filters :  ${JSON.stringify(filterDto)}`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User   "${
        user.username
      }"  Creating a new task Payload Data:  ${JSON.stringify(createTaskDto)}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<DeleteResult> {
    return this.taskService.deleteTaskById(id, user);
  }
  @Patch('/:id/status')
  updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, user);
  }
}

//before DATABASE
// @Get()
// getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
//   if (Object.keys(filterDto).length) {
//     return this.taskService.getTaskWithFilters(filterDto);
//   } else {
//     // console.log(' all ', filterDto);
//     return this.taskService.getAllTasks();
//   }
// }

// @Get('/:id')
// getTaskById(@Param('id') id: string): Task {
//   return this.taskService.getTaskById(id);
// }

// @Delete('/:id')
// deleleteTaskById(@Param('id') id: string): void {
//   return this.taskService.deleteTaskById(id);
// }

// @Patch('/:id/status')
// updateTaskById(
//   @Param('id') id: string,
//   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
// ): Task {
//   return this.taskService.updateTaskStatus(id, status);
// }
// @Post()
// @UsePipes(ValidationPipe)
// createTasks(@Body() createTaskDto: CreateTaskDto): Task {
//   return this.taskService.createTask(createTaskDto);
// }
//NO DTO
// @Post()
// createTasks(
//   @Body('title') title: string,
//   @Body('description') description: string,
// ) {
//   return this.taskService.createTask(title, description);
// }
