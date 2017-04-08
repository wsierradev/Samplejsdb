# SamplejsDB

In-memory javascript database that supports the following commands:

* SET name value – Sets variable name to specified value. Neither variable names nor values may contain spaces.

* GET name – Prints out value of variable name, or NULL if variable is not set.

* UNSET name – Unsets variable name, effectively making it as though variable was never set.

* NUMEQUALTO value – Prints out number of variables set to value. If no variables equal that value, print 0.

* END – Exits program. Program will always receive this as its last command.

* BEGIN – Opens new transaction block. Transaction blocks can be nested. BEGIN can be issued inside of an existing block.

* ROLLBACK – Undoes all commands issued in most recent transaction block, and closes block. Print nothing if successful, or print NO TRANSACTION if no transaction is in progress.

* COMMIT – Close all open transaction blocks, permanently applying changes made. Print nothing if successful. Print "NO TRANSACTION" if no transaction is in progress.

## Instructions

Install a version of Node.js (or io.js) and clone package to a local directory:

`git clone https://github.com/wsierradev/samplejsdb.git`

Run interactive command line with:

`npm run samplejsdb`

Run test suite with:

`npm run test`

## Details

In the interest of time database is built using a hash map as opposed to more efficient but more time consuming structures such as B-Trees, C-Trees and CSS-Trees.
