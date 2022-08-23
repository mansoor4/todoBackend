/* eslint-disable camelcase */
/* eslint-disable no-undef */
import {
    createTodo,
    getTodo,
    updateTodo,
    deleteTodo,
} from '../factories/todo';
import clearAllData from '../utils/clearAllData';
import createSession from '../utils/createSession';


let token = '';

const messageExpected = expect.any(String);
let todoExpected = expect.objectContaining({
    todo_id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
    complete: false,
});

afterAll(async () => {
    await new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(true), 500);
    });
});

describe('POST /todo/', () => {
    describe('Tests with 200 status', () => {
        beforeEach(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterEach(async () => {
            await clearAllData();
            token = '';
        });

        it('should answer with status code 200 and valid data when title and description is valid', async () => {
            const bodyExpected = {
                message: messageExpected,
                todo: todoExpected,
            };
            const respone = await createTodo(`Bearer ${token}`, 'test title', 'test description');
            const { status, body } = respone;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });
    });
    describe('Tests with other than 200 status', () => {
        beforeAll(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterAll(async () => {
            await clearAllData();
            token = '';
        });

        it('should answer with status code 401 when token not attach to header', async () => {
            const response = await createTodo('notSet', 'test title', 'test description');
            const { status } = response;
            expect(status).toEqual(401);
        });


        it('should answer with status code 401 when token is invalid', async () => {
            const response = await createTodo('valid_token', 'test title', 'test description');
            const { status } = response;
            expect(status).toEqual(401);
        });

        it('should answer with status code 500 when token is invalid', async () => {
            const response = await createTodo('Bearer invalid_token', 'test title', 'test description');
            const { status } = response;
            expect(status).toEqual(500);
        });

        it('should answer with status code 400 when receive an empty title', async () => {
            const response = await createTodo(`Bearer ${token}`, 'test title', 'test description', ['titleEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive title having characters > 100', async () => {
            const response = await createTodo(`Bearer ${token}`, 'test title', 'test description', ['titleMoreThan100Characters']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty description', async () => {
            const response = await createTodo(`Bearer ${token}`, 'test title', 'test description', ['descriptionEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });
    });
});


describe('GET /todo/', () => {
    describe('Tests with 200 status', () => {
        beforeEach(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterEach(async () => {
            await clearAllData();
            token = '';
        });

        it('should answer with status 200 with empty array', async () => {
            const bodyExpected = expect.objectContaining({
                todos: [],
            });

            const response = await getTodo(`Bearer ${token}`);
            const { status, body } = response;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });

        it('should answer with status 200 with 1 element in the array', async () => {
            todoExpected = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title',
                description: 'test description',
                complete: false,
            });

            const bodyExpected = expect.objectContaining({
                todos: expect.arrayContaining([todoExpected]),
            });

            await createTodo(`Bearer ${token}`, 'test title', 'test description');
            const response = await getTodo(`Bearer ${token}`);
            const { status, body } = response;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });

        it('should answer with status 200 with 3 element in the array in descending order of created time', async () => {
            const todoExpected1 = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title1',
                description: 'test description1',
                complete: false,
            });

            const todoExpected2 = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title2',
                description: 'test description2',
                complete: false,
            });

            const todoExpected3 = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title3',
                description: 'test description3',
                complete: false,
            });

            const bodyExpected = expect.objectContaining({
                todos: expect.arrayContaining([
                    todoExpected3,
                    todoExpected2,
                    todoExpected1,
                ]),
            });

            await createTodo(`Bearer ${token}`, 'test title1', 'test description1');
            await createTodo(`Bearer ${token}`, 'test title2', 'test description2');
            await createTodo(`Bearer ${token}`, 'test title3', 'test description3');

            const response = await getTodo(`Bearer ${token}`);
            const { status, body } = response;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });
    });
    describe('Tests with other than 200 status', () => {
        it('should answer with status code 401 when token not attach to header', async () => {
            const response = await getTodo('notSet');
            const { status } = response;
            expect(status).toEqual(401);
        });


        it('should answer with status code 401 when token is invalid', async () => {
            const response = await getTodo('valid_token');
            const { status } = response;
            expect(status).toEqual(401);
        });

        it('should answer with status code 500 when token is invalid', async () => {
            const response = await getTodo('Bearer invalid_token');
            const { status } = response;
            expect(status).toEqual(500);
        });
    });
});

describe('PUT /todo/:todoId', () => {
    let todoId = 'testTodoId';
    describe('Tests with 200 status', () => {
        beforeEach(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterEach(async () => {
            await clearAllData();
            token = '';
            todoId = 'testTodoId';
        });

        it('should answer with status 200 and updated data when text and description is valid', async () => {
            todoExpected = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title',
                description: 'updated test description',
                complete: false,
            });

            const bodyExpected = expect.objectContaining({
                todos: expect.arrayContaining([todoExpected]),
            });

            const createResponse = await createTodo(`Bearer ${token}`, 'test title', 'test description');
            const { body: createBody } = createResponse;
            todoId = createBody.todo.todo_id;
            const updateResponse = await updateTodo(todoId, `Bearer ${token}`, 'test title', 'updated test description', false);
            const getResponse = await getTodo(`Bearer ${token}`);
            const { status } = updateResponse;
            const { body: getBody } = getResponse;
            expect(status).toEqual(200);
            expect(getBody).toEqual(bodyExpected);
        });

        it('should answer with status 200 and complete should be false', async () => {
            todoExpected = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title',
                description: 'test description',
                complete: false,
            });

            const bodyExpected = expect.objectContaining({
                todos: expect.arrayContaining([todoExpected]),
            });

            const createResponse = await createTodo(`Bearer ${token}`, 'test title', 'test description');
            const { body: createBody } = createResponse;
            todoId = createBody.todo.todo_id;
            await updateTodo(todoId, `Bearer ${token}`, 'test title', 'test description', true);
            const updateResponse = await updateTodo(todoId, `Bearer ${token}`, 'test title', 'test description', false);
            const getResponse = await getTodo(`Bearer ${token}`);
            const { status } = updateResponse;
            const { body: getBody } = getResponse;
            expect(status).toEqual(200);
            expect(getBody).toEqual(bodyExpected);
        });

        it('should answer with status 200 and complete should be true', async () => {
            todoExpected = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title',
                description: 'test description',
                complete: true,
            });

            const bodyExpected = expect.objectContaining({
                todos: expect.arrayContaining([todoExpected]),
            });

            const createResponse = await createTodo(`Bearer ${token}`, 'test title', 'test description');
            const { body: createBody } = createResponse;
            todoId = createBody.todo.todo_id;
            const updateResponse = await updateTodo(todoId, `Bearer ${token}`, 'test title', 'test description', true);
            const getResponse = await getTodo(`Bearer ${token}`);
            const { status } = updateResponse;
            const { body: getBody } = getResponse;
            expect(status).toEqual(200);
            expect(getBody).toEqual(bodyExpected);
        });
    });
    describe('Tests with other than 200 status', () => {
        beforeAll(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterAll(async () => {
            await clearAllData();
            token = '';
        });

        it('should answer with status code 401 when token not attach to header', async () => {
            const response = await updateTodo(todoId, 'notSet', 'test title', 'updated test description', false);
            const { status } = response;
            expect(status).toEqual(401);
        });


        it('should answer with status code 401 when token is invalid', async () => {
            const response = await updateTodo(todoId, 'valid_token', 'test title', 'updated test description', false);
            const { status } = response;
            expect(status).toEqual(401);
        });

        it('should answer with status code 500 when token is invalid', async () => {
            const response = await updateTodo(todoId, 'Bearer invalid_token', 'test title', 'updated test description', false);
            const { status } = response;
            expect(status).toEqual(500);
        });

        it('should answer with status code 400 when receive an empty title', async () => {
            const response = await updateTodo(todoId, `Bearer ${token}`, 'test title', 'updated test description', false, ['titleEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive title having characters > 100', async () => {
            const response = await updateTodo(todoId, `Bearer ${token}`, 'test title', 'updated test description', false, ['titleMoreThan100Characters']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty description', async () => {
            const response = await updateTodo(todoId, `Bearer ${token}`, 'test title', 'updated test description', false, ['descriptionEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status 400 when todoId is empty', async () => {
            const response = await updateTodo('', `Bearer ${token}`, 'test title', 'updated test description', false);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status 500 when todoId is invalid', async () => {
            const response = await updateTodo('invalid todoId', `Bearer ${token}`, 'test title', 'updated test description', false);
            const { status } = response;
            expect(status).toEqual(500);
        });
    });
});

describe('DELETE /todo/:todoId', () => {
    let todoId = 'testTodoId';
    describe('Tests with 200 status', () => {
        beforeEach(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterEach(async () => {
            await clearAllData();
            token = '';
            todoId = 'testTodoId';
        });

        it('should answer with status 200 and number of todos should be 0', async () => {
            const createResponse = await createTodo(`Bearer ${token}`, 'test title', 'test description');
            const { body: createBody } = createResponse;
            todoId = createBody.todo.todo_id;
            const deleteResponse = await deleteTodo(todoId, `Bearer ${token}`);
            const getResponse = await getTodo(`Bearer ${token}`);
            const { status } = deleteResponse;
            const { body: getBody } = getResponse;
            expect(status).toEqual(200);
            expect(getBody.todos.length).toEqual(0);
        });

        it('should answer with status 200 and valid data and number of todos should be 1', async () => {
            todoExpected = expect.objectContaining({
                todo_id: expect.any(String),
                title: 'test title1',
                description: 'test description1',
                complete: false,
            });

            const bodyExpected = expect.objectContaining({
                todos: expect.arrayContaining([todoExpected]),
            });

            await createTodo(`Bearer ${token}`, 'test title1', 'test description1');
            const createResponse = await createTodo(`Bearer ${token}`, 'test title2', 'test description2');
            const { body: createBody } = createResponse;
            todoId = createBody.todo.todo_id;
            const deleteResponse = await deleteTodo(todoId, `Bearer ${token}`);
            const getResponse = await getTodo(`Bearer ${token}`);
            const { status } = deleteResponse;
            const { body: getBody } = getResponse;
            expect(status).toEqual(200);
            expect(getBody).toEqual(bodyExpected);
            expect(getBody.todos.length).toEqual(1);
        });
    });
    describe('Tests with other than 200 status', () => {
        beforeAll(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterAll(async () => {
            await clearAllData();
            token = '';
        });

        it('should answer with status code 401 when token not attach to header', async () => {
            const response = await deleteTodo(todoId, 'notSet');
            const { status } = response;
            expect(status).toEqual(401);
        });


        it('should answer with status code 401 when token is invalid', async () => {
            const response = await deleteTodo(todoId, 'valid_token');
            const { status } = response;
            expect(status).toEqual(401);
        });

        it('should answer with status code 500 when token is invalid', async () => {
            const response = await deleteTodo(todoId, 'Bearer invalid_token');
            const { status } = response;
            expect(status).toEqual(500);
        });

        it('should answer with status 400 when todoId is empty', async () => {
            const response = await deleteTodo('', `Bearer ${token}`);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status 500 when todoId is invalid', async () => {
            const response = await deleteTodo('invalid todoId', `Bearer ${token}`);
            const { status } = response;
            expect(status).toEqual(500);
        });
    });
});
