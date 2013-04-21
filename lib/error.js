/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:37
 */

var $util = require('util');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerError (message, details)
{
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.logger:LoggerError';
    this.message = 'swift.logger: ' + message;
    this.details = details;
}
$util.inherits(LoggerError, Error);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerError        = LoggerError;
exports.LoggerManagerError = require('./errors/loggerManagerError').LoggerManagerError;