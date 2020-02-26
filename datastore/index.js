const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {}; // this no longer necessary in refactor to async & persistant data

// Public API - Fix these CRUD functions ///////////////////////////////////////

//ABSOLUTELY NEED standardized error-first callbacks. Pay close attention to this to avoid
//wasting time debugging.

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  counter.getNextUniqueId((err, id) => {
  //this function transforms into a callback itself because the returned value for
  //getNextUniqueId is from a callback.
    var filePath = path.join(exports.dataDir, `${id}.txt`); //nice format for filePath
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      }
      callback(null, { id, text });
    });
  });

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    }

    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      return {
        id: id,
        text: id
      };
    });

    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
