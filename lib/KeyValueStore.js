"use strict";

/**
 * A simple key value store used as primary in-memory store for a SamplejsDB.
 */

 let Constants = require("./constants");

function KeyValueStore() {
  this.data = {};
}

KeyValueStore.prototype.put = function(name, value) {
  this.data[name] = value;
};

KeyValueStore.prototype.get = function(name) {
  return this.data[name];
};

KeyValueStore.prototype.delete = function(name) {
  this.data[name] = Constants.NO_VALUE;
};

module.exports = KeyValueStore;
