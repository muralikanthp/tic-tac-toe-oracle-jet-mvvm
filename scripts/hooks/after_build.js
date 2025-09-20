/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/

'use strict';

const fs = require('fs');
const archiver = require('archiver');

module.exports = function (configObj) {
  return new Promise((resolve, reject) => {
  	console.log("Running after_build hook.");

    const fileName = "mini-games.war";
    const output = fs.createWriteStream(fileName);

    const archive = archiver('zip');
    output.on('close', () => {
      console.log(`Created ${fileName} file successfully.`);
      resolve();
    });

    archive.on('warning', (error) => {
      console.warn(error);
    });

    archive.on('error', (error) => {
      reject(error);
    });

    archive.pipe(output);
    archive.directory('web', false);
    archive.finalize();
  });
};
