/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:58
 */

var $util = require('util'),

    SwiftLoggerError = require('./swiftLoggerError').SwiftLoggerError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerManagerError (message, details)
{
    SwiftLoggerError.call(this, 'LoggerManager: ' + message, details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.logger:LoggerManagerError';
}
$util.inherits(LoggerManagerError, SwiftLoggerError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// static
//

LoggerManagerError.codes = {
    BAD_LOGGER:            'BAD_LOGGER',
    BAD_LOGGER_NAME:       'BAD_LOGGER_NAME',
    LOGGER_ALREADY_EXISTS: 'LOGGER_ALREADY_EXISTS',
    SYSTEM_ERROR:          'SYSTEM_ERROR'
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerManagerError = LoggerManagerError;