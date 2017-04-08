"use strict";

/**
 * SamplejsDB - Simple in-memory key-value store that maintains index on count of each value.
 */

let KeyValueStore = require("./KeyValueStore");
let ValueCountIndex = require("./ValueCountIndex");
let Constants = require("./constants");

function SamplejsDB() {
  this.nameData = new KeyValueStore();
  this.valueIndex = new ValueCountIndex();
}

SamplejsDB.prototype.set = function(name, value, dbms) {
  // If in a transaction, the transaction's value index might not have the count for the previous value at
  // [name], so get it from the DBMS and store the new count in the current transaction.
  let previousValue = dbms.get(name);
  if (previousValue !== Constants.NO_VALUE) {
    this.valueIndex.setCount(previousValue, dbms.numEqualTo(previousValue) - 1);
  }

  this.nameData.put(name, value);

  // Likewise, value index might not have actual count of new value to store at [name], so we get it from the
  // DBMS as well and store the new count in the current transaction.
  let newValueCount = dbms.numEqualTo(value);
  this.valueIndex.setCount(value, newValueCount + 1);
};

SamplejsDB.prototype.get = function(name) {
  return this.nameData.get(name);
};

SamplejsDB.prototype.unset = function(name, dbms) {
  // The current transaction's copy of the value index might not have the count for the previous value at [name], so get
  // it from the DBMS and store the updated count in the current transaction.
  let previousValue = dbms.get(name);
  this.valueIndex.setCount(previousValue, dbms.numEqualTo(previousValue) - 1);

  this.nameData.delete(name);
};

SamplejsDB.prototype.numEqualTo = function(value) {
  return this.valueIndex.getCount(value);
};

SamplejsDB.prototype.merge = function(other) {
  for (let name in other.nameData) {
    this.nameData[name] = other.nameData[name];
  }

  for (let value in other.valueIndex) {
    this.valueIndex[value] = other.valueIndex[value];
  }
};

module.exports = SamplejsDB;
