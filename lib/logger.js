/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 19.04.13
 * Time: 12:47
 */

var $fs = require('fs'),
    $path = require('path'),

    fsUtil = require('../../utils/fs'),
    typeUtil = require('../../utils/type'),
    LoggerError = require('./error').LoggerError,

    countLoggers = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Logger = Logger;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Logger (params)
{
    countLoggers++;

    this._needWS = true;

    this._name = 'logger_' + countLoggers;
    this._pathToLogFile = null;
    this._encoding = 'UTF-8';
    this._wStream = null;

    this.init(params);
}

/**
 * Задание имени логгера
 *
 * @param {String} name имя логгера
 *
 * @returns {Logger}
 */
Logger.prototype.setName = function setName (name)
{
    if (typeof name !== 'string' || !name.length) return this;

    this._name = name;

    return this;
};

/**
 * Получение имени логгера
 *
 * @returns {String}
 */
Logger.prototype.getName = function getName ()
{
    return this._name;
};

/**
 * Задание пути к лог-файлу
 *
 * @param {String} pathToLogFile путь к лог-файлу
 *
 * @returns {Logger}
 */
Logger.prototype.setPathToLog = function setPathToLog (pathToLogFile)
{
    if (typeof pathToLogFile !== 'string' || !pathToLogFile.length) return this;

    this._pathToLogFile = $path.normalize(pathToLogFile);
    this._needWS = true;

    return this;
};

/**
 * Получение пути к лог-файлу
 *
 * @returns {String}
 */
Logger.prototype.getPathToLog = function getPathToLog ()
{
    return this._pathToLogFile;
};

/**
 * Задание кодировки
 *
 * @param {String} encoding кодировка
 *
 * @returns {Logger}
 */
Logger.prototype.setEncoding = function setEncoding (encoding)
{
    if (typeof encoding !== 'string' || !encoding.length) return this;

    this._encoding = encoding;
    this._needWS = true;

    return this;
};

/**
 * Получение кодировки
 *
 * @returns {String}
 */
Logger.prototype.getEncoding = function getEncoding ()
{
    return this._encoding;
};

/**
 * Инициализация логгера
 *
 * @param {Object} params параметры
 *
 * @returns {Logger}
 */
Logger.prototype.init = function init (params)
{
    if (!typeUtil.isObject(params)) params = {};

    if (typeof params.pathToLog !== 'undefined') this.setPathToLog(params.pathToLog);
    if (typeof params.encoding !== 'undefined') this.setEncoding(params.encoding);

    return this;
};

/**
 * Создание потока записи
 *
 * @returns {Logger}
 * @private
 */
Logger.prototype._createWriteStream = function _createWriteStream ()
{
    try
    {
        var pathToLogFileArr = this._pathToLogFile.split('/'),
            pathToLogDir;

        pathToLogFileArr.pop();
        pathToLogDir = pathToLogFileArr.join('/');

        if (!fsUtil.existsSync(pathToLogDir)) fsUtil.createDirReq(pathToLogDir);

        this._wStream = $fs.createWriteStream(this._pathToLogFile, {
            flags: 'a',
            encoding: this._encoding,
            mode: 0777
        });

        this._needWS = false;
    }
    catch (e)
    {
        throw new LoggerError({
            msg: 'не удалось создать поток записи',
            earlier: e
        });
    }

    return this;
};

/**
 * Логирование
 *
 * @param {String} text текст для логирования
 * @param {Function} cb
 *
 * @returns {Logger}
 */
Logger.prototype.log = function log (text, cb)
{
    if (typeof cb !== 'function') cb = function(){};

    if (this._pathToLogFile === null)
    {
        cb(new LoggerError({
            msg: 'logger: не удалось логировать запись "' + text + '". Не задан путь к лог-файлу'
        }), null);
        return this;
    }

    //
    // создание потока записи
    //

    if (this._needWS)
    {
        try
        {
            this._createWriteStream();
        }
        catch (e)
        {
            cb(new LoggerError({
                msg: 'logger: не удалось логировать запись "' + text + '"',
                earlier: e
            }), null);
            return this;
        }
    }

    //
    // запись текста
    //

    this._wStream.write(text + '\r\n', function (err)
    {
        if (err)
        {
            cb(['logger: не удалось логировать запись "' + text + '"', err], null);
            return;
        }

        cb(null, null);
    });

    //
    ////
    //

    return this;
};