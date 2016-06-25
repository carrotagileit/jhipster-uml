'use strict';

const fs = require('fs'),
    xml2js = require('xml2js'),
    EditorDetector = require('./editor_detector'),
    JDL = require('jhipster-domain-language'),
    Editors = require('./editors'),
    SQLTypes = require('../types/sql_types'),
    MongoDBTypes = require('../types/mongodb_types'),
    CassandraTypes = require('../types/cassandra_types'),
    buildException = require('../exceptions/exception_factory').buildException,
    exceptions = require('../exceptions/exception_factory').exceptions;

/**
 * Creates a parser.
 * @param args {Object} the arguments: file, files, and databaseType.
 * @return {Parser} the created parser.
 */
exports.createParser = function (args) {
  if (!args || (!args.file && !args.files) || !args.databaseType) {
    throw new buildException(
        exceptions.IllegalArgument,
        'The file/s and the database type must be passed');
  }
  var types = initDatabaseTypeHolder(args.databaseType);
  return getXMIFileParser(args.file, types);
};

function getXMIFileParser(file, databaseType) {
  var root = getRootElement(readFileContent(file));
  var detectedEditor = EditorDetector.detect(root);
  return new Editors.Parsers[detectedEditor](root, databaseType);
}

function readFileContent(file) {
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    throw new buildException(
        exceptions.WrongFile,
        `The passed file '${file}' must exist and must not be a directory.`);
  }
  return fs.readFileSync(file, 'utf-8');
}

function getRootElement(content) {
  var root;
  var parser = new xml2js.Parser();
  parser.parseString(content, function (err, result) {
    if (result.hasOwnProperty('uml:Model')) {
      root = result['uml:Model'];
    } else if (result.hasOwnProperty('xmi:XMI')) {
      root = result['xmi:XMI']['uml:Model'][0];
    } else {
      throw new buildException(
          exceptions.NoRoot,
          'The passed document has no immediate root element.');
    }
  });
  return root;
}

function initDatabaseTypeHolder(databaseTypeName) {
  switch (databaseTypeName) {
    case 'sql':
      return new SQLTypes();
    case 'mongodb':
      return new MongoDBTypes();
    case 'cassandra':
      return new CassandraTypes();
    default:
      throw new buildException(exceptions.WrongDatabaseType,
          'The passed database type is incorrect. '
          + "It must either be 'sql', 'mongodb', or 'cassandra'."
          + `Got '${databaseTypeName}'.`);
  }
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
