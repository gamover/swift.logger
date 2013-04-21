/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:37
 */

var $util = require('util'),

    $swiftUtils = require('swift.utils'),
    typeUtil = $swiftUtils.type;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SwiftLoggerError (msg, details)
{
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    var msgArr = ['возникли ошибки в модуле "swift.logger"'];

    if (typeof details === 'undefined') details = [];
    else if (!typeUtil.isArray(details)) details = [details];
    if (typeof msg === 'string' && msg.length) details.unshift(msg);

    msgArr = msgArr.concat(details);

    this.name = 'SwiftLoggerError';
    this.message = msgArr.join('\r\n') + '\r\n';
}
$util.inherits(SwiftLoggerError, Error);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.SwiftLoggerError   = SwiftLoggerError;
exports.LoggerManagerError = require('./errors/loggerManagerError').LoggerManagerError;
exports.LoggerError        = require('./errors/loggerError').LoggerError;