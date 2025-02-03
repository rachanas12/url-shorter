import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const options : swaggerJSDoc.Options= {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'A URL shortener API with analytics',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        googleAuth: {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: '/auth/google',
              scopes: {
                'profile': 'Access profile information',
                'email': 'Access email',
              },
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/routes/*/*.ts", // Routes folder
    "./src/routes/*.ts", // Routes folder
    "./src/models/*.ts", // Models folder
  ],
};

const swaggerSpec = swaggerJSDoc(options);
const filePath = path.join(process.cwd(), "public/swagger/main.js");

fs.writeFile(
  filePath,
  `(async () => {
      const docs = document.getElementById('docs');
      const apiDescriptionDocument = ${JSON.stringify(swaggerSpec)};
      docs.apiDescriptionDocument = apiDescriptionDocument;
    })();
`,
  err => {
    if (err) {
      console.error("Error writing to file:", err);
      return;
    }
    console.log("File has been written successfully.");
  },
);
export { swaggerUi, swaggerSpec };
