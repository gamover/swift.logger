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

    LoggerError = require('./errors/loggerError').LoggerError,

    countLoggers = 0;

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
    if (this._isRun) throw new LoggerError()
        .setMessage('Не удалось сменить имя логгеру "' + this.getName() + '". Логгер уже запущен')
        .setCode(LoggerError.codes.LOGGER_ALREADY_RUNNING);
    if (typeof name !== 'string' || !name.length) throw new LoggerError()
        .setMessage('Не удалось задать имя логгеру. Имя не передано или представлено в недопустимом формате')
        .setCode(LoggerError.codes.BAD_NAME);

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
    if (this._isRun) throw new LoggerError()
        .setMessage('Не удалось задать путь к лог-файлу в логгере "' + this.getName() + '". Логгер уже запущен')
        .setCode(LoggerError.codes.LOGGER_ALREADY_RUNNING);
    if (typeof pathToLogFile !== 'string' || !pathToLogFile.length) throw new LoggerError()
        .setMessage('Не удалось задать путь к лог-файлу в логгере "' + this.getName() + '". Путь не передан или представлен в недопустимом формате')
        .setCode(LoggerError.codes.BAD_PATH_TO_LOG);

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
    if (this._isRun) throw new LoggerError()
        .setMessage('Не удалось задать кодировку в логгере "' + this.getName() + '". Логгер уже запущен')
        .setCode(LoggerError.codes.LOGGER_ALREADY_RUNNING);
    if (typeof encoding !== 'string' || !encoding.length) throw new LoggerError()
        .setMessage('Не удалось задать кодировку в логгере "' + this.getName() + '". Название кодировки не передано или представлено в недопустимом формате')
        .setCode(LoggerError.codes.BAD_ENCODING);

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
 * Инициализация логгера
 *
 * @param {Object} params параметры
 *
 * @returns {Logger}
 * @private
 */
Logger.prototype.init = function init (params)
{
    if (!$swiftUtils.type.isObject(params)) params = {};

    if ('name' in params) this.setName(params.name);
    if ('pathToLog' in params) this.setPathToLog(params.pathToLog);
    if ('encoding' in params) this.setEncoding(params.encoding);

    return this;
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
    if (this._isRun)
    {
        cb(new LoggerError()
            .setMessage('Не удалось запустить логгер "' + this.getName() + '". Логгер уже запущен')
            .setCode(LoggerError.codes.LOGGER_ALREADY_RUNNING));
        return this;
    }
    if (this._pathToLogFile === null)
    {
        cb(new LoggerError()
            .setMessage('Не удалось запустить логгер "' + this.getName() + '". Не задан путь к лог-файлу')
            .setCode(LoggerError.codes.PATH_TO_LOG_FILE_UNDEFINED));
        return this;
    }

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

        cb(null);
    }
    catch (e)
    {
        cb(new LoggerError()
            .setMessage('Не удалось запустить логгер "' + this.getName() + '" (ответ node: ' + e.message + ')')
            .setDetails(e)
            .setCode(LoggerError.codes.SYSTEM_ERROR));
    }

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

    if (this.isDisabled()) return this;

    if (typeof cb !== 'function') cb = function(){};

    if (!this._isRun)
    {
        cb(new LoggerError()
            .setMessage('Не удалось произвести логирование в логгере "' + this._name + '". Логгер не запущен')
            .setCode(LoggerError.codes.LOGGER_NOT_RUNNING));
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
    else log();

    //
    // логирование
    //

    function log()
    {
        self._wStream.write(text + '\r\n', function (err)
        {
            if (err)
            {
                cb(new LoggerError()
                    .setMessage('Не удалось произвести логирование в логгере "' + self.getName() + '" (ответ node: ' + err.message + ')')
                    .setDetails(err)
                    .setCode(LoggerError.codes.SYSTEM_ERROR));
                return;
            }

            cb(null);
        });
    }

    //
    ////
    //

    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Logger = Logger;