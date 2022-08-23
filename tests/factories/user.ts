import path from 'path';
import request from 'supertest';
import app from '../../src/app';


const agent = request(app);

export const createUser = (condition: string[] = []):
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    const profilePath = path.resolve(__dirname, '..', '..', 'assets', 'mansoor.jpg');

    const firstName = (() => {
        if (condition.includes('firstNameEmpty')) return '';
        return 'testFirstName';
    })();

    const lastName = (() => {
        if (condition.includes('lastNameEmpty')) return '';
        return 'testLastName';
    })();

    const contact = (() => {
        if (condition.includes('contactEmpty')) return '';
        if (condition.includes('contactLessThan10Digits')) return '123456789';
        if (condition.includes('contactGreaterThan10Digits')) return '12345678901';
        return '1234567890';
    })();

    const address = (() => {
        if (condition.includes('addressEmpty')) return '';
        return 'test address';
    })();

    const email = (() => {
        if (condition.includes('emailEmpty')) return '';
        if (condition.includes('emailWithNot@')) return 'testgmail.com';
        if (condition.includes('emailWithNot.')) return 'test@gmailcom';
        return 'test@gmail.com';
    })();

    const username = (() => {
        if (condition.includes('usernameEmpty')) return '';
        if (condition.includes('usernameLessThan6Characters')) return 'test';
        return 'test123';
    })();

    const password = (() => {
        if (condition.includes('passwordEmpty')) return '';
        if (condition.includes('passwordLessThan6Characters')) return '12345';
        return '12345678';
    })();


    if (condition.includes('profilePathEmpty')) {
        agent.post('/auth/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('firstName', firstName)
            .field('lastName', lastName)
            .field('contact', contact)
            .field('address', address)
            .field('email', email)
            .field('username', username)
            .field('password', password)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.post('/auth/signup')
            .set('Content-Type', 'multipart/form-data')
            .field('firstName', firstName)
            .field('lastName', lastName)
            .field('contact', contact)
            .field('address', address)
            .field('email', email)
            .field('username', username)
            .field('password', password)
            .attach('profile', profilePath, { filename: 'mansoor.jpg' })
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});

export const updateUser = (token: string, condition: string[] = []):
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    const profilePath = condition.includes('profilePathUpdated')
        ? path.resolve(__dirname, '..', '..', 'assets', 'gcoea.jpg')
        : path.resolve(__dirname, '..', '..', 'assets', 'mansoor.jpg');

    const fileName = condition.includes('profilePathUpdated')
        ? 'gcoea.jpg' : 'mansoor.jpg';

    const removeProfile = condition.includes('removeProfile') ? 'true' : 'false';


    const firstName = (() => {
        if (condition.includes('firstNameEmpty')) return '';
        return 'updatedTestFirstName';
    })();

    const lastName = (() => {
        if (condition.includes('lastNameEmpty')) return '';
        return 'updatedTestLastName';
    })();

    const contact = (() => {
        if (condition.includes('contactEmpty')) return '';
        if (condition.includes('contactLessThan10Digits')) return '123456789';
        if (condition.includes('contactGreaterThan10Digits')) return '12345678901';
        return '0987654321';
    })();

    const address = (() => {
        if (condition.includes('addressEmpty')) return '';
        return 'updated test address';
    })();

    const email = (() => {
        if (condition.includes('emailEmpty')) return '';
        if (condition.includes('emailWithNot@')) return 'testgmail.com';
        if (condition.includes('emailWithNot.')) return 'test@gmailcom';
        return 'updatedtest@gmail.com';
    })();

    if (token === 'notSet') {
        agent.put('/user/')
            .set('Content-Type', 'multipart/form-data')
            .field('firstName', firstName)
            .field('lastName', lastName)
            .field('contact', contact)
            .field('address', address)
            .field('email', email)
            .field('removeProfile', removeProfile)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else if (condition.includes('profilePathEmpty')) {
        agent.put('/user/')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('firstName', firstName)
            .field('lastName', lastName)
            .field('contact', contact)
            .field('address', address)
            .field('email', email)
            .field('removeProfile', removeProfile)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.put('/user/')
            .set('Authorization', token)
            .set('Content-Type', 'multipart/form-data')
            .field('firstName', firstName)
            .field('lastName', lastName)
            .field('contact', contact)
            .field('address', address)
            .field('email', email)
            .field('removeProfile', removeProfile)
            .attach('profile', profilePath, { filename: fileName })
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});

export const getUser = (token: string):
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    if (token === 'notSet') {
        agent.get('/user/')
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    } else {
        agent.get('/user/')
            .set('Authorization', token)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
    }
});

export const signinUser = (condition: string[] = []):
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    const user = {
        username: 'test123',
        password: '12345678',
    };
    if (condition.includes('usernameEmpty')) user.username = '';
    if (condition.includes('usernameInvalid')) user.username = 'test1';
    if (condition.includes('passwordEmpty')) user.password = '';
    if (condition.includes('passwordInvalid')) user.password = '12345';

    agent.post('/auth/signin')
        .send(user)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
});

export const refreshToken = ():
    Promise<request.Response> => new
Promise<request.Response>((resolve, reject) => {
    agent.post('/auth/refreshToken')
        .send({ userId: '' })
        .then((response) => resolve(response))
        .catch((err) => reject(err));
});
