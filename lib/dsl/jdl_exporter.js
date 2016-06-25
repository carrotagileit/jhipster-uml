'use strict';

const buildException = require('../exceptions/exception_factory').buildException,
    exceptions = require('../exceptions/exception_factory').exceptions;

module.exports = {
  exportToJDL: exportToJDL
};

function exportToJDL(parsedData) {
  if (!parsedData) {
    throw new buildException(exceptions.NullPointer, 'The parsed data must be passed');
  }
  throw new buildException(exceptions.UnimplementedOperation);
}
