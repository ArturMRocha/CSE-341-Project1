// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'API para gerenciar contatos pessoais.'
  },
  host: 'cse-341-spring-0wcg.onrender.com', // Ex: 'cse341-project.onrender.com'
  schemes: ['https://'], // Use 'http' para testes locais
  definitions: {
    Contact: {
      firstName: "João",
      lastName: "Silva",
      email: "joao@email.com",
      favoriteColor: "Azul",
      birthday: "10/05/1990"
    },
    NewContactResponse: {
      id: "60c72b2f9b1e8a001c8e4d2a"
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./Routes/index.js']; // Seu arquivo de rotas principal

// Gera o swagger-output.json
swaggerAutogen(outputFile, endpointsFiles, doc);