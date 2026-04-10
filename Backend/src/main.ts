import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { seedSubjects } from './infrastructure/database/seed/subjects.seed';
import { seedAdmin } from './infrastructure/database/seed/admin.seed';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors();

    // Seeds au démarrage
    const dataSource = app.get(DataSource);
    await seedSubjects(dataSource);
    await seedAdmin(dataSource);

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('Plateforme Épreuves IAI')
        .setDescription('API de la plateforme d\'épreuves intelligentes — IAI')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
        .addTag('Auth', 'Inscription et connexion')
        .addTag('Admin', 'Administration — teachers et annonces')
        .addTag('Annonces', 'Annonces publiques')
        .addTag('Subjects', 'Matières par filière')
        .addTag('Exams', 'Gestion des épreuves')
        .addTag('Trainings', 'Sessions d\'entraînement')
        .addTag('Forum', 'Forum de discussion')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Serveur: http://localhost:${process.env.PORT || 3000}`);
  console.log(`Documentation: http://localhost:${process.env.PORT || 3000}/api/docs`);
  console.log(`Accès réseau: http://192.168.1.70:${process.env.PORT || 3000}`);
}
bootstrap();