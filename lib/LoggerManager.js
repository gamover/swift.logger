/**
 * Created by G@mOBEP
 *
 * Date: 20.04.13
 * Time: 22:09
 *
 * Менеджер логгеров Swift.
 */

var $swiftUtils = require('swift.utils'),

    typeUtil = $swiftUtils.type,

    error = require('./error'),
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

    if (loggerName in this._loggers)
        throw new error.LoggerManagerError('не удалось добавить логгер в LoggerManager.' +
            ' Логгер с именем "' + loggerName + '" уже существует');
    if (!(logger instanceof Logger))
        throw new error.LoggerManagerError('не удалось добавить логгер "' + loggerName + '" в LoggerManager.' +
            ' Логгер не передан или представлен в недопустимом формате');

    //
    // перегрузка метода задания имени логгера
    //

    logger.setName = function (name)
    {
        if (name === loggerName) return this;

        if (name in self._loggers)
            throw new error.LoggerManagerError('не удалось задать имя логгеру в LoggerManager.' +
                ' Логгер с именем "' + name + '" уже существует');

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
 * @param {Object} params параметры логгера
 *
 * @returns {LoggerManager}
 */
LoggerManager.prototype.createLogger = function createLogger (params)
{
    this.addLogger(new Logger(params));

    return this;
};

/**
 * Получение логгера по имени
 *
 * @param {String} loggerName имя логгера
 *
 * @returns {Logger|undefined}
 */
LoggerManager.prototype.getLogger = function getLogger (loggerName)
{
    if (typeof loggerName !== 'string' || !loggerName.length)
        throw new error.LoggerManagerError('не удалось получить логгер из LoggerManager.' +
            ' Имя логгера не передано или представлено в недопустимом формате');

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
    if (typeof loggerName !== 'string' || !loggerName.length)
        throw new error.LoggerManagerError('не удалось удалить логгер из LoggerManager.' +
            ' Имя логгера не передано или представлено в недопустимом формате');

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