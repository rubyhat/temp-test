require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const schemaJsonUrl =
    process.env.BACKEND_BASE_PATH + '/api/openapi/swagger.json';

function fetchSchemaJson() {
    console.log(`[OpenAPI] Fetching schema from ${schemaJsonUrl}`);
    axios
        .get(schemaJsonUrl)
        .then(res => {
            const { data } = res;

            fs.writeFileSync(
                path.join(process.cwd(), 'swagger/schema.json'),
                JSON.stringify(data, undefined, 4)
            );
            console.log('[OpenAPI] Schema updated in swagger/schema.json');
        })
        .catch(err => console.log(err));
}

fetchSchemaJson();
