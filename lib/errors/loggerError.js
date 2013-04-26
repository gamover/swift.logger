/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:58
 */

var $util = require('util'),

    SwiftLoggerError = require('./swiftLoggerError').SwiftLoggerError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerError (message, details)
{
    SwiftLoggerError.call(this, 'Logger: ' + message, details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.logger:LoggerError';
}
$util.inherits(LoggerError, SwiftLoggerError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// static
//

LoggerError.codes = {
    BAD_ENCODING:               'BAD_ENCODING',
    BAD_NAME:                   'BAD_NAME',
    BAD_PATH_TO_LOG:            'BAD_PATH_TO_LOG',
    LOGGER_ALREADY_EXISTS:      'LOGGER_ALREADY_EXISTS',
    LOGGER_ALREADY_RUNNING:     'LOGGER_ALREADY_RUNNING',
    LOGGER_NOT_RUNNING:         'LOGGER_NOT_RUNNING',
    PATH_TO_LOG_FILE_UNDEFINED: 'PATH_TO_LOG_FILE_UNDEFINED',
    SYSTEM_ERROR:               'SYSTEM_ERROR'
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerError = LoggerError;