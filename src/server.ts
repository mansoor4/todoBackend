import config from 'config';
import app from './app';
import { SERVER } from './types/config';

const { SERVER_PORT, SERVER_SECURE } = config.get('SERVER') as SERVER;

/* Server Start */
app.listen(SERVER_PORT, () => {
    console.log(`Server Started at port ${SERVER_PORT}`);
    console.log(SERVER_SECURE);
});
