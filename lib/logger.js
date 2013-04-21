/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 19.04.13
 * Time: 12:47
 *
 * Логгер.
 */

var $fs = require('fs'),
    $path = require('path'),

    $swiftUtils = require('swift.utils'),
    fsUtil = $swiftUtils.fs,
    typeUtil = $swiftUtils.type,

    error = require('./error'),

    countLoggers = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Logger = Logger;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Logger (params)
{
    countLoggers++;

    /**
     * Имя логгера
     *
     * @type {String}
     * @private
     */
    this._name = 'logger_' + countLoggers;

    /**
     * Путь к лог-файлу
     *
     * @type {String}
     * @private
     */
    this._pathToLogFile = null;

    /**
     * Кодировка
     *
     * @type {String}
     * @private
     */
    this._encoding = 'UTF-8';

    /**
     * Поток записи
     *
     * @type {WriteStream}
     * @private
     */
    this._wStream = null;

    /**
     * Флаг указывающий необходимость создания нового потока
     *
     * @type {Boolean}
     * @private
     */
    this._needWS = true;

    //
    // инициализация
    //

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
    if (typeof name !== 'string' || !name.length)
        throw new error.LoggerError('не удалось задать имя логгеру.' +
            ' Имя не передано или представлено в недопустимом формате');

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
    if (typeof pathToLogFile !== 'string' || !pathToLogFile.length)
        throw new error.LoggerError('не удалось задать путь к лог-файлу.' +
            ' Путь не передан или представлен в недопустимом формате');

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
    if (typeof encoding !== 'string' || !encoding.length)
        throw new error.LoggerError('не удалось задать кодировку.' +
            ' Название кодировки не передано или представлено в недопустимом формате');

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

    if ('name' in params) this.setName(params.name);
    if ('pathToLog' in params) this.setPathToLog(params.pathToLog);
    if ('encoding' in params) this.setEncoding(params.encoding);

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
    if (this._pathToLogFile === null)
        throw new error.LoggerError('не удалось создать поток записи.' +
            ' Не задан путь к лог-файлу');

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
        throw new error.LoggerError('не удалось создать поток записи', e);
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
            cb(e, null);
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
            cb(new error.LoggerError('не удалось логировать запись', err), null);
            return;
        }

        cb(null, null);
    });

    //
    ////
    //

    return this;
};