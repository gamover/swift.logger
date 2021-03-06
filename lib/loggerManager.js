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
 * Создание логгера
 *
 * @param {String} loggerName имя логгера
 *
 * @returns {Logger}
 */
LoggerManager.prototype.createLogger = function createLogger (loggerName)
{
    //
    // создание логгера
    //
    var logger = new Logger();
    //
    // задание имени логгеру
    //
    if (loggerName != null)
    {
        logger.setName(loggerName);
    }
    //
    // добавление логгера в набор
    //
    this.addLogger(logger);

    return logger;
};

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
    {
        throw new $swiftErrors.SystemError('не удалось добавить логгер в менеджер логгеров. Логгер с именем "' +
            loggerName + '" уже существует');
    }
    //
    // перегрузка метода задания имени логгера
    //
    logger.setName = function (name)
    {
        if (name === this._name)
        {
            return this;
        }

        if (name in self._loggers)
        {
            throw new $swiftErrors.ValueError('не удалось изменить имя логгеру "' + loggerName + '". Имя "' + name + '" уже занято другим логгером');
        }
        //
        // задание имени логгеру
        //
        loggerSetName.call(this, name);
        //
        // обновление набора логгеров
        //
        self._loggers[name] = self._loggers[loggerName];
        delete self._loggers[loggerName];

        return this;
    };
    //
    // добавление логгера в набор
    //
    this._loggers[loggerName] = logger;

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