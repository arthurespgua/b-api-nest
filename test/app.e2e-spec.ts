import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

describe('Exception Filter (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('debería retornar 404 con formato BaseExceptionDto', async () => {
    const res = await request(app.getHttpServer()).get('/departments/999999').expect(HttpStatus.NOT_FOUND);

    expect(res.body).toMatchObject({
      statusCode: 404,
      mensaje: 'Información no encontrada, favor de validar.',
      detalles: expect.arrayContaining([expect.any(String)]),
      timestamp: expect.any(String),
      path: expect.stringMatching(/\/departments\/999999/),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
