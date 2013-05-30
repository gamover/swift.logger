/**
 * Created by G@mOBEP
 *
 * Date: 20.04.13
 * Time: 22:09
 *
 * Менеджер логгеров Swift.
 */

var $swiftErrors = require('swift.errors'),
    $swiftUtils = require('swift.utils'),

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
        loggerName,
        loggerSetName;
    //
    // проверка параметров
    //
    if (!(logger instanceof Logger))
        throw new $swiftErrors.TypeError('Недопустимый тип логгера (ожидается: "Logger", принято: "' + typeof logger + '").');

    loggerName = logger.getName();
    loggerSetName = logger.setName;

    if (loggerName in this._loggers)
        throw new $swiftErrors.ValueError('Логгер с именем "' + loggerName + '" уже существует.');
    //
    // перегрузка метода задания имени логгера
    //
    logger.setName = function (name)
    {
        //
        // проверка параметров
        //
        if (typeof name !== 'string')
            throw new $swiftErrors.TypeError('Недопустимый тип имени логгера (ожидается: "string", принято: "' + typeof name + '").');
        if (!name.length)
            throw new $swiftErrors.ValueError('Недопустимое значение имени логгера.');

        if (name === loggerName) return this;

        if (loggerName in self._loggers)
            throw new $swiftErrors.ValueError('Имя "' + loggerName + '" уже занято другим логгером.');
        //
        // задание имени логгеру
        //
        loggerSetName.call(this, name);
        //
        // обновление набора логгеров
        //
        self._loggers[name] = self._loggers[loggerName];
        delete self._loggers[loggerName];
        loggerName = name;

        return this;
    };
    //
    // добавление логгера в набор
    //
    this._loggers[loggerName] = logger;

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
    //
    // проверка параметров
    //
    if (typeof loggerName !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип имени логгера (ожидается: "string", принято: "' + typeof loggerName + '").');
    if (!loggerName.length)
        throw new $swiftErrors.ValueError('Недопустимое значение имени логгера.');

    if (!$swiftUtils.type.isObject(params)) params = {};
    params.name = loggerName;
    //
    // создание логгера и добавление его в набор
    //
    this.addLogger(new Logger(params));

    return this;
};

/**
 * Получение логгера
 *
 * @param {String} loggerName имя логгера
 *
 * @returns {Logger|null}
 */
LoggerManager.prototype.getLogger = function getLogger (loggerName)
{
    return (this._loggers[loggerName] || null);
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
 * Удаление логгера
 *
 * @param {String} loggerName имя логгера
 *
 * @returns {LoggerManager}
 */
LoggerManager.prototype.removeLogger = function removeLogger (loggerName)
{
    //
    // проверка параметров
    //
    if (typeof loggerName !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип имени логгера (ожидается: "string", принято: "' + typeof loggerName + '").');
    if (!loggerName.length)
        throw new $swiftErrors.ValueError('Недопустимое значение имени логгера.');
    //
    // удаление логгера
    //
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