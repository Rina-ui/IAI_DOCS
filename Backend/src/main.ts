import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  // Configuration Swagger
  const config = new DocumentBuilder()
      .setTitle('Plateforme Épreuves Intelligentes')
      .setDescription(`
## API de la plateforme d'épreuves intelligentes

### Fonctionnalités
- Consultation des épreuves des années passées
- Entraînement interactif avec correction IA
- Forum de discussion
- Gestion des utilisateurs (Student, Teacher, Admin)

### Authentification
Toutes les routes protégées nécessitent un **Bearer Token JWT**.
1. Créer un compte via \`POST /auth/register\`
2. Se connecter via \`POST /auth/login\`
3. Copier le token et cliquer sur **Authorize** 
    `)
      .setVersion('1.0')
      .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Entrez votre token JWT',
          },
          'JWT-auth',
      )
      .addTag('Auth', 'Inscription et connexion')
      .addTag('Exams', 'Gestion des épreuves')
      .addTag('Trainings', 'Sessions d\'entraînement')
      .addTag('Forum', 'Forum de discussion')
      .build();

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