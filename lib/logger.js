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

    $swiftErrors = require('swift.errors'),
    $swiftUtils = require('swift.utils'),

    countLoggers = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Logger ()
{
    countLoggers++;

    /**
     * Имя логгера
     *
     * @type {String}
     * @private
     */
    this._name = 'logger' + countLoggers;

    /**
     * Путь к лог-файлу
     *
     * @type {String|null}
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
     * @type {WriteStream|null}
     * @private
     */
    this._wStream = null;

    /**
     * Флаг указывающий что логгер запущен
     *
     * @type {Boolean}
     * @private
     */
    this._isRun = false;

    /**
     * Флаг указывающий что логгер деактивирован
     *
     * @type {Boolean}
     * @private
     */
    this._disabled = false;
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
    this._pathToLogFile = $path.normalize(pathToLogFile);

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
    this._encoding = encoding;

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
 * Запуск логгера
 *
 * @param {Function} cb
 *
 * @returns {Logger}
 */
Logger.prototype.run = function run (cb)
{
    try
    {
        var pathToLogFileArr = this._pathToLogFile.split('/'),
            pathToLogDir;

        pathToLogFileArr.pop();
        pathToLogDir = pathToLogFileArr.join('/');

        if (!$swiftUtils.fs.existsSync(pathToLogDir)) $swiftUtils.fs.createDirReq(pathToLogDir);

        this._wStream = $fs.createWriteStream(this._pathToLogFile, {
            flags: 'a',
            encoding: this._encoding,
            mode: '0666'
        });

        this._isRun = true;
    }
    catch (err)
    {
        cb(err);
        return this;
    }

    cb(null);

    return this;
};

/**
 * Остановка логгера
 *
 * @returns {Logger}
 */
Logger.prototype.stop = function stop ()
{
    this._wStream = null;
    this._isRun   = false;

    return this;
};

/**
 * Проверка запущен ли логгер
 *
 * @returns {Boolean}
 */
Logger.prototype.isRun = function isRun ()
{
    return this._isRun;
};

/**
 * Деактивация логгера
 *
 * @returns {Logger}
 */
Logger.prototype.disable = function disable ()
{
    this._disabled = true;

    return this;
};

/**
 * Активация логгера
 *
 * @returns {Logger}
 */
Logger.prototype.enable = function enable ()
{
    this._disabled = false;

    return this;
};

/**
 * Проверка активен ли логгер
 *
 * @returns {Boolean}
 */
Logger.prototype.isDisabled = function isDisabled ()
{
    return this._disabled;
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
    var self = this;

    if (typeof cb !== 'function')
    {
        cb = function(){};
    }

    if (this.isDisabled() || !this._isRun)
    {
        cb(null);
        return this;
    }

    if (!$swiftUtils.fs.existsSync(this._pathToLogFile))
    {
        this._isRun = false;
        this.run(function (err)
        {
            if (err)
            {
                cb(err);
                return;
            }

            log();
        });
    }
    else
    {
        log();
    }
    //
    // логирование
    //
    function log()
    {
        self._wStream.write(text + '\r\n', function (err)
        {
            if (err)
            {
                cb(err);
                return;
            }

            cb(null);
        });
    }

    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Logger = Logger;