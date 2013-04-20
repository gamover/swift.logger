/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 19.04.13
 * Time: 14:10
 */

var $util = require('util'),

    typeUtil = require('swift.utils').utils.type;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerError = LoggerError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerError (fields)
{
    var self = this;

    this.msg = null;
    this.earlier = null;
    this.custom = null;

    if (!typeUtil.isObject(fields)) fields = {};

    Object.keys(fields).forEach(function (fieldName)
    {
        if (typeof self[fieldName] !== 'undefined') self[fieldName] = fields[fieldName];
    });
}
$util.inherits(LoggerError, Error);