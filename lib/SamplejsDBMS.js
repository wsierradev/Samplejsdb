"use strict";

/**
 * This is the DBMS for a SamplejsDB, it serves as the external interface to a SamplejsDB instance and encapsulates
 * the primary database and the transaction manager.
 */

let SamplejsDB = require("./SamplejsDB");
let TransactionManager = require("./TransactionManager");
let Constants = require("./constants");

function SamplejsDBMS() {
  this.database = new SamplejsDB();
  this.transactionManager = new TransactionManager();
}

/**
 * Return the current database operations should be performed on, which is either the current transaction if one exists,
 * or the primary database.
 */
SamplejsDBMS.prototype.getCurrentDatabase = function() {
  return this.transactionManager.getCurrentTransaction() || this.database;
};

SamplejsDBMS.prototype.set = function(name, value) {
  this.getCurrentDatabase().set(name, value, this);
};

/**
 * Get needs to iterate over the currently open transactions to find the most current value for [name]. A value of
 * Constants.DELETED_KEY indicates the key was unset in that transaction.
 */
SamplejsDBMS.prototype.get = function(name) {
  let result = this.transactionManager.visitTransactions(function(database) {
    let value = database.get(name);
    if (value !== undefined) {
      return value === Constants.DELETED_KEY ? Constants.NO_VALUE : value;
    }
  });

  return result !== undefined ? result : this.database.get(name) || Constants.NO_VALUE;
};

SamplejsDBMS.prototype.unset = function(name) {
  this.getCurrentDatabase().unset(name, this);
};

/**
 * Get needs to iterate over the currently open transactions to find the most current count for [value].
 */
SamplejsDBMS.prototype.numEqualTo = function(value) {
  let result = this.transactionManager.visitTransactions(function(database) {
    if (database.numEqualTo(value) !== undefined) {
      return database.numEqualTo(value);
    }
  });
  return result !== undefined ? result : this.database.numEqualTo(value) || 0;
};

SamplejsDBMS.prototype.begin = function() {
  this.transactionManager.openTransaction();
};

SamplejsDBMS.prototype.rollback = function() {
  if (this.transactionManager.getCurrentTransaction()) {
    this.transactionManager.rollbackCurrentTransaction();
  } else {
    return Constants.NO_TRANSACTION;
  }
};

SamplejsDBMS.prototype.commit = function() {
  if (this.transactionManager.getCurrentTransaction()) {
    this.transactionManager.commitAllTransactions(this.database);
  } else {
    return Constants.NO_TRANSACTION;
  }
};

module.exports = SamplejsDBMS;
