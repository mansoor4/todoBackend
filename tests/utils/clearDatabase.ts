import db from '../../src/db';

const clearDatabase = (): Promise<Boolean> => new Promise<Boolean>((resolve, reject) => {
    const data = {
        text: 'DELETE FROM user_account',
        values: [],
    };
    db.query(data)
        .then(() => resolve(true))
        .catch((err) => reject(err));
});


export default clearDatabase;
