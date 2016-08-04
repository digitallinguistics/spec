/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Storage = require('azure-storage'); // Azure Storage SDK

// Add Azure credentials to environment variable when testing locally
if (process.env.NODE_ENV === 'local') {
  require('../../credentials/dlx-spec');
}

const storage = Storage.createBlobService(); // create the Blob Service

const readSchema = filename => new Promise((resolve, reject) => {

  // FIXME: `filename` currently stores the blobName from Azure
  // It needs to store the local filename instead
  // This means you'll have to read the schemas folder *as well as* the blobs list in Azure

  const filepath = path.join(__dirname, '../schemas', filename);

  fs.readFile(filepath, 'utf8', (err, text) => {
    if (err) { reject(err); }
    resolve(text);
  });

});

// TODO: listen for errors in promises, and throw the error with iterator.throw
const runGenerator = (generator, generatorArgs) => {

  const args = Array.isArray(generatorArgs) ? generatorArgs : [generatorArgs];
  const iterator = generator(...args);
  let result;

  (function iterate(val) {

    result = iterator.next(val);

    if (!result.done) {
      if (result.value instanceof Promise) {
        result.value.then(iterate);
      } else {
        setTimeout(() => { iterate(result.value); }, 0);
      }
    }

  }());

};

/*
const uploadSchema = (blobName, filepath, schema) => new Promise((resolve, reject) => {

  const metadata = { version: blobName.match(/-().json/)[1] };
  console.log(metadata);

  storage.createBlockBlobFromLocalFile('schemas', blobName, filepath);
});
*/

const updateSchema = filename => new Promise((resolve, reject) => {

  // TODO: use a try-catch to handle errors
  runGenerator(function* update() {
    const text = yield readSchema(filename);
    const schema = JSON.parse(text);
    const blobName = schema.id.match(/\/schemas\/([^/]+\.json)/)[1];
    const blobExists = blobList.includes(blobName);

    if (blobExists) {

      console.log(`Schema ${blobName} up to date.`);

    } else if (!blobExists) {

      const uploaded = yield uploadSchema(blobName, filepath, schema);

      if (uploaded) {
        console.log(`Schema ${blobName} uploaded successfully.`);
      } else if (!uploaded) {
        console.error(`Schema ${blobName} could not be uploaded.`);
      }

    }
  }, [filename]);

});

// TODO: need to handle continuation tokens
const getBlobList = () => new Promise(resolve => {
  storage.listBlobsSegmented('schemas', null, (err, res) => {
    if (err) {
      console.error('Unable to list blobs.');
      console.error(err, err.stack);
    }
    const blobList = [...res.entries.map(entry => entry.name)];
    resolve(blobList);
  });
});

const updateSchemas = blobList => Promise.all(blobList.map(updateSchema));

// TODO: This actually needs to have 3 steps:
// 1. getBlobList (from Azure Storage)
// 2. getFileList (from /schemas)
// 3. updateSchemas
// 4. Log success
// 5. Log errors
// Because this is now 3 steps rather than 2, and requires saving some data,
// (the blob/file lists), use a generator here insetad
getBlobList()
.then(updateSchemas)
.then(() => console.log(`All schemas successfully updated.`))
.catch(err => {
  console.error(`An error occurred during update.`);
  console.error(err, err.stack);
});
