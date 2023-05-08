import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

const server = async () => {
  //server uses nodeenv object by default
  const serverConfig = config.get('server');

  const logger = new Logger('taskauth');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV == 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting request from origin ${serverConfig.origin} `);
  }

  //process env is set by setting it when running the server like => PORT=3005 yarn start:dev
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port} `);
};
server();
