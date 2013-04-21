/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:59
 */

var $util = require('util'),

    $swiftUtils = require('swift.utils'),
    typeUtil = $swiftUtils.type,

    SwiftLoggerError = require('../error').SwiftLoggerError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerError (msg, details)
{
    if (typeof details === 'undefined') details = [];
    else if (!typeUtil.isArray(details)) details = [details];
    if (typeof msg === 'string' && msg.length) details.unshift(msg);

    SwiftLoggerError.call(this, 'возникли ошибки в логгере', details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'LoggerError';
}
$util.inherits(LoggerError, SwiftLoggerError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerError = LoggerError;