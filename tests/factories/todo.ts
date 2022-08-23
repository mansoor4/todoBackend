import request from 'supertest';
import app from '../../src/app';


const agent = request(app);

export const createTodo = (
    token: string,
    testTitle: string,
    testDescription: string,
    condition: string[] = [],
)
    : Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    const title = (() => {
        if (condition.includes('titleEmpty')) return '';
        if (condition.includes('titleMoreThan100Characters')) return 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
        return testTitle;
    })();

    const description = (() => {
        if (condition.includes('descriptionEmpty')) return '';
        return testDescription;
    })();

    const body = {
        title,
        description,
    };

    if (token === 'notSet') {
        agent.post('/todo/')
            .send(body)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.post('/todo/')
            .set('Authorization', token)
            .send(body)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});

export const updateTodo = (
    todoId: string,
    token: string,
    TestTitle: string,
    updatedTestDescription: string,
    updatedTestComplete: boolean,
    condition: string[] = [],
)
    : Promise<request.Response> => new
Promise<request.Response>((resolve,
    reject) => {
    const title = (() => {
        if (condition.includes('titleEmpty')) return '';
        if (condition.includes('titleMoreThan100Characters')) return 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';
        return TestTitle;
    })();

    const description = (() => {
        if (condition.includes('descriptionEmpty')) return '';
        return updatedTestDescription;
    })();

    const complete = updatedTestComplete;

    const body = {
        title,
        description,
        complete,
    };

    if (token === 'notSet') {
        agent.put(`/todo/${todoId}`)
            .send(body)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.put(`/todo/${todoId}`)
            .set('Authorization', token)
            .send(body)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});


export const getTodo = (token: string):
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    if (token === 'notSet') {
        agent.get('/todo/')
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.get('/todo/')
            .set('Authorization', token)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});

export const deleteTodo = (todoId: string, token: string):
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    if (token === 'notSet') {
        agent.delete(`/todo/${todoId}`)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.delete(`/todo/${todoId}`)
            .set('Authorization', token)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});
