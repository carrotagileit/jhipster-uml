'use strict';

var AbstractMappedTypes = require('./abstract_mapped_types');

/**
 * This class extends the Types interface to provide the MongoDB types
 * supported by JHipster.
 */
var MongoDBTypes = module.exports = function() {
  this.types = {
    String: [ 'required', 'minlength', 'maxlength', 'pattern' ],
    Integer: [ 'required', 'min', 'max' ],
    Long: [ 'required', 'min', 'max' ],
    BigDecimal: [ 'required', 'min', 'max' ],
    LocalDate : [ 'required' ],
    DateTime : [ 'required' ],
    Boolean : [],
    Enum : [ 'required' ]
  }
};

// inheritance stuff
MongoDBTypes.prototype = Object.create(AbstractMappedTypes.prototype);
MongoDBTypes.prototype.constructor = AbstractMappedTypes;