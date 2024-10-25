import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthService } from '../auth.lib.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    validateUser: () => ({ data: { id: 1, email: 'user@example.com' } }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) should return user data', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password123' })
      .expect(201)
      .expect({
        data: { id: 1, email: 'user@example.com' },
      });
  });

  it('/auth/login (POST) should return 401 if invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
