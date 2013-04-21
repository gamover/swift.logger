/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:58
 */

var $util = require('util'),

    $swiftUtils = require('swift.utils'),
    typeUtil = $swiftUtils.type,

    LoggerError = require('../error').LoggerError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerManagerError (message, details)
{
    LoggerError.call(this, message, details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.logger:LoggerManagerError';
}
$util.inherits(LoggerManagerError, LoggerError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerManagerError = LoggerManagerError;