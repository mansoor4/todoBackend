import clearAssets from './clearAssets';
import clearDatabase from './clearDatabase';

const clearAllData = (): Promise<Boolean> => new Promise<Boolean>((resolve, reject) => {
    clearDatabase()
        .then((result) => {
            if (result) {
                clearAssets()
                    .then(() => resolve(true))
                    .catch((err) => reject(err));
            }
        })
        .catch((err) => reject(err));
});


export default clearAllData;
