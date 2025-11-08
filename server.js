const express = require('express');
const app = express();
const mongodb = require('./data/database')
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // Importa o arquivo gerado

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', require('./Routes'));

mongodb.initDb((err) => {
    if(err){
        console.log(err);
    } else {
        app.listen(port, () => {console.log(`Database is listening and node is running on port ${port}`)});
    }
});