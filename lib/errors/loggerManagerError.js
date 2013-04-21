/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:58
 */

var $util = require('util'),

    $swiftUtils = require('swift.utils'),
    typeUtil = $swiftUtils.type,

    SwiftLoggerError = require('../error').SwiftLoggerError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerManagerError (msg, details)
{
    if (typeof details === 'undefined') details = [];
    else if (!typeUtil.isArray(details)) details = [details];
    if (typeof msg === 'string' && msg.length) details.unshift(msg);

    SwiftLoggerError.call(this, 'возникли ошибки в менеджере логгеров', details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'LoggerManagerError';
}
$util.inherits(LoggerManagerError, SwiftLoggerError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerManagerError = LoggerManagerError;