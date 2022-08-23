import { createUser, signinUser } from '../factories/user';

const createSession = (condition: string = ''): Promise<string> => new Promise<string>((resolve, reject) => {
    createUser([condition])
        .then((response) => {
            if (response) {
                signinUser()
                    .then((res) => resolve(res.body.token))
                    .catch((err) => reject(err));
            }
        })
        .catch((err) => reject(err));
});

export default createSession;
