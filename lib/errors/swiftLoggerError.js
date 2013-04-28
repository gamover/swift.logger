/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:37
 */

var $util = require('util');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SwiftLoggerError (message, details)
{
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'SwiftLoggerError';
    this.message = 'swift.logger: ' + message;
    this.details = details || null;
    this.code    = null;
}
$util.inherits(SwiftLoggerError, Error);

/**
 * Задание сообщения об ошибке
 *
 * @param {String} message сообщение об ошибке
 *
 * @returns {SwiftLoggerError}
 */
SwiftLoggerError.prototype.setMessage = function setMessage (message)
{
    this.message = message;
    return this;
};

/**
 * Задание деталей
 *
 * @param {*} details детали
 *
 * @returns {SwiftLoggerError}
 */
SwiftLoggerError.prototype.setDetails = function setMessage (details)
{
    this.details = details;
    return this;
};

/**
 * Задание кода ошибки
 *
 * @param {String} code код ошибки
 *
 * @returns {SwiftLoggerError}
 */
SwiftLoggerError.prototype.setCode = function setCode (code)
{
    this.code = code;
    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.SwiftLoggerError   = SwiftLoggerError;
exports.LoggerManagerError = require('./loggerManagerError').LoggerManagerError;
exports.LoggerError        = require('./loggerError').LoggerError;