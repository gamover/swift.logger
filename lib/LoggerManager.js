/**
 * Created by G@mOBEP
 *
 * Date: 20.04.13
 * Time: 22:09
 *
 * Менеджер логгеров Swift.
 */

var $swiftUtils = require('swift.utils'),

    LoggerManagerError = require('./errors/loggerManagerError').LoggerManagerError,
    Logger = require('./logger').Logger;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function LoggerManager ()
{
    /**
     * Набор логгеров
     *
     * @type {Object}
     * @private
     */
    this._loggers = {};
}

/**
 * Добавление логгера
 *
 * @param {Logger} logger логгер
 *
 * @returns {LoggerManager}
 */
LoggerManager.prototype.addLogger = function addLogger (logger)
{
    var self = this,
        loggerName = logger.getName(),
        loggerSetName = logger.setName;

    if (loggerName in this._loggers) throw new LoggerManagerError()
        .setMessage('Не удалось добавить логгер. Логгер с именем "' + loggerName + '" уже существует')
        .setCode(LoggerManagerError.codes.LOGGER_ALREADY_EXISTS);
    if (!(logger instanceof Logger)) throw new LoggerManagerError()
        .setMessage('Не удалось добавить логгер "' + loggerName + '". Логгер не передан или представлен в недопустимом формате')
        .setCode(LoggerManagerError.codes.BAD_LOGGER);

    //
    // перегрузка метода задания имени логгера
    //

    logger.setName = function (name)
    {
        if (name === loggerName) return this;

        if (name in self._loggers) throw new LoggerManagerError()
            .setMessage('Не удалось задать имя логгеру. Логгер с именем "' + name + '" уже существует')
            .setCode(LoggerManagerError.codes.LOGGER_ALREADY_EXISTS);

        loggerSetName.call(this, name);

        self._loggers[name] = self._loggers[loggerName];
        delete self._loggers[loggerName];
        loggerName = name;

        return this;
    };

    //
    // добавление логгера в набор
    //

    this._loggers[loggerName] = logger;

    //
    ////
    //

    return this;
};

/**
 * Создание логгера
 *
 * @param {String} loggerName имя логгера
 * @param {Object} params параметры логгера
 *
 * @returns {LoggerManager}
 */
LoggerManager.prototype.createLogger = function createLogger (loggerName, params)
{
    if (typeof loggerName !== 'string' || !loggerName.length) throw new LoggerManagerError()
        .setMessage('Не удалось создать логгер. Имя логгера не передано или представлено в недопустимом формате')
        .setCode(LoggerManagerError.codes.BAD_LOGGER_NAME);

    if (!$swiftUtils.type.isObject(params)) params = {};
    params.name = loggerName;

    this.addLogger(new Logger(params));

    return this;
};

/**
 * Получение логгера
 *
 * @param {String} loggerName имя логгера
 *
 * @returns {Logger|undefined}
 */
LoggerManager.prototype.getLogger = function getLogger (loggerName)
{
    if (typeof loggerName !== 'string' || !loggerName.length) throw new LoggerManagerError()
        .setMessage('Не удалось получить логгер. Имя логгера не передано или представлено в недопустимом формате')
        .setCode(LoggerManagerError.codes.BAD_LOGGER_NAME);

    return this._loggers[loggerName];
};

/**
 * Получение всех логгеров
 *
 * @returns {Object}
 */
LoggerManager.prototype.getAllLoggers = function getAllLoggers ()
{
    return this._loggers;
};

/**
 * Удаление логгера по имени
 *
 * @param {String} loggerName имя логгера
 *
 * @returns {LoggerManager}
 */
LoggerManager.prototype.removeLogger = function removeLogger (loggerName)
{
    if (typeof loggerName !== 'string' || !loggerName.length) throw new LoggerManagerError()
            .setMessage('Не удалось удалить логгер. Имя логгера не передано или представлено в недопустимом формате')
            .setCode(LoggerManagerError.codes.BAD_LOGGER_NAME);

    delete this._loggers[loggerName];

    return this;
};

/**
 * Удаление всех логгеров
 *
 * @returns {LoggerManager}
 */
LoggerManager.prototype.removeAllLoggers = function removeAllLoggers ()
{
    this._loggers = {};

    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.LoggerManager = LoggerManager;