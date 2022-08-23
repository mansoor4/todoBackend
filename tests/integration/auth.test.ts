/* eslint-disable no-undef */
import clearAllData from '../utils/clearAllData';
import { createUser, signinUser, refreshToken } from '../factories/user';
import getUploadedImageDetail from '../utils/getUploadedImageDetail';

const messageExpected = expect.any(String);
const userExpected = {
    userId: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
    username: expect.any(String),
    email: expect.any(String),
    contact: expect.any(String),
    address: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
};
const profileExpected = {
    name: expect.any(String),
    url: expect.any(String),
    fileName: expect.any(String),
};

afterAll(async () => {
    await new Promise<boolean>((resolve) => {
        setTimeout(() => resolve(true), 500);
    });
});

describe('POST /auth/signup', () => {
    afterEach(async () => {
        await clearAllData();
    });

    describe('Tests with 200 status', () => {
        it('should answer with status code 200 when profile is uplaoded and count of uploaded image should be 1', async () => {
            const response = await createUser();
            const resources = await getUploadedImageDetail();
            const { status } = response;
            expect(status).toEqual(200);
            expect(resources.length).toEqual(1);
        });

        it('should answer with status code 200 when profile is not uploaded and count of uploaded image should be 0', async () => {
            const response = await createUser(['profilePathEmpty']);
            const resources = await getUploadedImageDetail();
            const { status } = response;
            expect(status).toEqual(200);
            expect(resources.length).toEqual(0);
        });
    });

    describe('Tests with other than 200 status', () => {
        it('should answer with status code 400 when receive an empty first name', async () => {
            const response = await createUser(['firstNameEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty last name', async () => {
            const response = await createUser(['lastNameEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty contact', async () => {
            const response = await createUser(['contactEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an contact having digits < 10', async () => {
            const response = await createUser(['contactLessThan10Digits', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an contact having digits > 10', async () => {
            const response = await createUser(['contactGreaterThan10Digits', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty address', async () => {
            const response = await createUser(['addressEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty email', async () => {
            const response = await createUser(['emailEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an email with no @', async () => {
            const response = await createUser(['emailWithNot@', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an email with no .', async () => {
            const response = await createUser(['emailWithNot.', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty username', async () => {
            const response = await createUser(['usernameEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an username having characters < 6', async () => {
            const response = await createUser(['usernameLessThan6Characters', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an username already present in database', async () => {
            await createUser(['profilePathEmpty']);
            const response = await createUser(['profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty password', async () => {
            const response = await createUser(['passwordEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an password having characters < 6', async () => {
            const response = await createUser(['passwordLessThan6Characters', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });
    });
});

describe('POST /auth/signin', () => {
    const userIdExpected = expect.any(String);
    const tokenExpected = expect.any(String);


    describe('Tests with 200 status', () => {
        afterEach(async () => {
            await clearAllData();
        });

        it('should return an object with proper data when username and password are valid and profile is uploaded and answer with status 200', async () => {
            const bodyExpected = expect.objectContaining({
                message: messageExpected,
                user: userExpected,
                profile: profileExpected,
                userId: userIdExpected,
                token: tokenExpected,
            });
            await createUser();
            const respone = await signinUser();
            const { status, body } = respone;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });

        it('should return an object with proper data when username and password are valid and profile is not uploaded and answer with status 200', async () => {
            const bodyExpected = expect.objectContaining({
                message: messageExpected,
                user: userExpected,
                userId: userIdExpected,
                token: tokenExpected,
            });
            await createUser(['profilePathEmpty']);
            const respone = await signinUser();
            const { status, body } = respone;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });
    });

    describe('Tests with other than 200 status', () => {
        beforeAll(async () => {
            await createUser(['profilePathEmpty']);
        });

        afterAll(async () => {
            await clearAllData();
        });

        it('should answer with status code 400 when receive an empty username', async () => {
            const respone = await signinUser(['usernameEmpty']);
            const { status } = respone;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an invalid username', async () => {
            const respone = await signinUser(['usernameInvalid']);
            const { status } = respone;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty password', async () => {
            const respone = await signinUser(['passwordEmpty']);
            const { status } = respone;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an invalid password', async () => {
            const respone = await signinUser(['passwordInvalid']);
            const { status } = respone;
            expect(status).toEqual(400);
        });
    });
});

describe('POST /auth/refreshToken', () => {
    const tokenExpected = expect.any(String);
    const bodyExpected = expect.objectContaining({
        token: tokenExpected,
    });

    it('should send token and answer with status 200', async () => {
        const respone = await refreshToken();
        const { status, body } = respone;
        expect(status).toEqual(200);
        expect(body).toEqual(bodyExpected);
    });
});
