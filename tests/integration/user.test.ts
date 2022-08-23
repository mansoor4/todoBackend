/* eslint-disable no-undef */

import clearAllData from '../utils/clearAllData';
import createSession from '../utils/createSession';
import { updateUser, getUser } from '../factories/user';
import getUploadedImageDetail from '../utils/getUploadedImageDetail';
import extractFileNameFromPublicId from '../utils/extractFileNameFromPublicId';

const messageExpected = expect.any(String);
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

describe('GET /user/', () => {
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

    describe('Tests with 200 status', () => {
        afterEach(async () => {
            await clearAllData();
        });

        it('should answer with status code 200 with valid token and get all the data', async () => {
            const bodyExpected = expect.objectContaining({
                user: userExpected,
                profile: profileExpected,
            });
            const token = await createSession();
            const response = await getUser(`Bearer ${token}`);
            const { status, body } = response;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });

        it('should answer with status code 200 with valid token and get all the data except profile', async () => {
            const bodyExpected = expect.objectContaining({
                user: userExpected,
            });
            const token = await createSession('profilePathEmpty');
            const response = await getUser(`Bearer ${token}`);
            const { status, body } = response;
            expect(status).toEqual(200);
            expect(body).toEqual(bodyExpected);
        });
    });

    describe('Tests with other than 200 status', () => {
        it('should answer with status code 401 when token not attach to header', async () => {
            const response = await getUser('notSet');
            const { status } = response;
            expect(status).toEqual(401);
        });


        it('should answer with status code 401 when token is invalid', async () => {
            const response = await getUser('valid_token');
            const { status } = response;
            expect(status).toEqual(401);
        });

        it('should answer with status code 500 when token is invalid', async () => {
            const response = await getUser('Bearer invalid_token');
            const { status } = response;
            expect(status).toEqual(500);
        });
    });
});

describe('PUT /user/', () => {
    describe('Tests with 200 status', () => {
        let token = '';
        afterEach(async () => {
            await clearAllData();
            token = '';
        });

        const userExpected = {
            firstName: 'updatedTestFirstName',
            lastName: 'updatedTestLastName',
            contact: '0987654321',
            address: 'updated test address',
            email: 'updatedtest@gmail.com',
        };

        describe('When profile is not uplaoded', () => {
            beforeEach(async () => {
                token = await createSession('profilePathEmpty');
            });

            it('should answer with status 200 and data which is updated, when profile is not uploaded and not updated', async () => {
                const bodyExpected = expect.objectContaining({
                    message: messageExpected,
                    user: userExpected,
                });
                const response = await updateUser(`Bearer ${token}`, ['profilePathEmpty']);
                const { status, body } = response;
                expect(status).toEqual(200);
                expect(body).toEqual(bodyExpected);
            });
        });


        describe('When profile is uplaoded', () => {
            beforeEach(async () => {
                token = await createSession();
            });

            it('should answer with status 200 and data which is updated, when profile is uploaded and not updated', async () => {
                const bodyExpected = expect.objectContaining({
                    message: messageExpected,
                    user: userExpected,
                    profile: profileExpected,
                });
                const response = await updateUser(`Bearer ${token}`, ['profilePathEmpty']);
                const { status, body } = response;
                expect(status).toEqual(200);
                expect(body).toEqual(bodyExpected);
            });


            it('should answer with status 200 and data which is updated and profile name should same as uploaded profile name and count of uploaded image should be one, when updated profile is same as uploaded', async () => {
                const bodyExpected = expect.objectContaining({
                    message: messageExpected,
                    user: userExpected,
                    profile: profileExpected,
                });
                const response = await updateUser(`Bearer ${token}`);
                const resources = await getUploadedImageDetail();
                const uploadedImageDetail = resources[0];
                const { public_id: publicId } = uploadedImageDetail;
                const { status, body } = response;
                expect(status).toEqual(200);
                expect(body).toEqual(bodyExpected);
                expect(extractFileNameFromPublicId(publicId)).toEqual('mansoor.jpg');
                expect(resources.length).toEqual(1);
            });

            it('should answer with status 200 and data which is updated and profile name should different as uploaded profile name and count of uploaded image should be one, when choose different profile as uploaded', async () => {
                const bodyExpected = expect.objectContaining({
                    message: messageExpected,
                    user: userExpected,
                    profile: profileExpected,
                });
                const response = await updateUser(`Bearer ${token}`, ['profilePathUpdated']);
                const resources = await getUploadedImageDetail();
                const uploadedImageDetail = resources[0];
                const { public_id: publicId } = uploadedImageDetail;
                const { status, body } = response;
                expect(status).toEqual(200);
                expect(body).toEqual(bodyExpected);
                expect(extractFileNameFromPublicId(publicId)).toEqual('gcoea.jpg');
                expect(resources.length).toEqual(1);
            });

            it('should answer with status 200 and data which is updated and count of uploaded image should be zero, when profile is removed', async () => {
                const bodyExpected = expect.objectContaining({
                    message: messageExpected,
                    user: userExpected,
                });
                const response = await updateUser(`Bearer ${token}`, ['profilePathEmpty', 'removeProfile']);
                const resources = await getUploadedImageDetail();
                const { status, body } = response;
                expect(status).toEqual(200);
                expect(body).toEqual(bodyExpected);
                expect(resources.length).toEqual(0);
            });
        });
    });

    describe('Tests with other than 200 status', () => {
        let token: string;
        beforeAll(async () => {
            token = await createSession('profilePathEmpty');
        });

        afterAll(async () => {
            await clearAllData();
        });

        it('should answer with status code 401 when token not attach to header', async () => {
            const response = await updateUser('notSet', ['profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(401);
        });


        it('should answer with status code 401 when token is invalid', async () => {
            const response = await updateUser('valid_token', ['profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(401);
        });

        it('should answer with status code 500 when token is invalid', async () => {
            const response = await updateUser('Bearer invalid_token', ['profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(500);
        });

        it('should answer with status code 400 when receive an empty first name', async () => {
            const response = await updateUser(`Bearer ${token}`, ['firstNameEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty last name', async () => {
            const response = await updateUser(`Bearer ${token}`, ['lastNameEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty contact', async () => {
            const response = await updateUser(`Bearer ${token}`, ['contactEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an contact having digits < 10', async () => {
            const response = await updateUser(`Bearer ${token}`, ['contactLessThan10Digits', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an contact having digits > 10', async () => {
            const response = await updateUser(`Bearer ${token}`, ['contactGreaterThan10Digits', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty address', async () => {
            const response = await updateUser(`Bearer ${token}`, ['addressEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an empty email', async () => {
            const response = await updateUser(`Bearer ${token}`, ['emailEmpty', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an email with no @', async () => {
            const response = await updateUser(`Bearer ${token}`, ['emailWithNot@', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });

        it('should answer with status code 400 when receive an email with no .', async () => {
            const response = await updateUser(`Bearer ${token}`, ['emailWithNot.', 'profilePathEmpty']);
            const { status } = response;
            expect(status).toEqual(400);
        });
    });
});
