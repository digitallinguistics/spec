// IMPORTS
const AJV        = require(`ajv`);
const getSchemas = require(`./getSchemas`);
const GeoJSON    = require(`./GeoJSON.json`);

// SETUP
const ajv = new AJV({ extendRefs: true });

// VARIABLES
let schemasLoaded = false;

// METHODS

/**
 * Retrieves the GeoJSON schema from the GeoJSON.json file
 * @return {Promise}
 */
function getGeoJSONSchema() {
  return new Promise(resolve => {

    resolve(GeoJSON);

  });
}

/**
 * Adds each of the schemas to AJV
 * @return {Promise<AJV>}
 */
async function loadSchemas() {

  if (schemasLoaded) return ajv;

  // Load DLx schemas
  const schemas = await getSchemas();

  for (const [, schema] of schemas) {

    // Extract the ID from the "id" property of the schema
    const IDRegExp = /\.io\/(?<$id>.+)-/;
    const { $id }   = IDRegExp.exec(schema.$id).groups;

    // Remove version number from ID for local testing purposes
    schema.$id = schema.$id.replace(/-.+?(\.json)/, `$1`);
    try {
      ajv.addSchema(schema, $id);
    } catch (e) {
      console.error(`${$id} schema is invalid.`);
      console.error(e);
    }

  }

  // Load GeoJSON schema
  const GeoJSONSchema = await getGeoJSONSchema();
  ajv.addSchema(GeoJSONSchema, `GeoJSON`);

  schemasLoaded = true;
  return ajv;

}

// EXPORT
module.exports = loadSchemas;
