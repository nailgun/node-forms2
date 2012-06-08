/*jslint node: true */

exports.ValidationError = ValidationError;

function ValidationError(code, message) {
    return {
        code: code,
        message: message,
    };
}

exports.Min = function (limit_value, opt) {
    return function (value, callback) {
        if (value < limit_value) {
            callback(ValidationError('min_value', 'ensure this value greater than or equal to ' + limit_value));
        } else {
            callback();
        }
    };
};

exports.Max = function (limit_value) {
    return function (value, callback) {
        if (value > limit_value) {
            callback(ValidationError('max_value', 'ensure this value less than or equal to ' + limit_value));
        } else {
            callback();
        }

    };
};

exports.Range = function (min_value, max_value) {
    return function (value, callback) {
        if (value < min_value || value > max_value) {
            callback(ValidationError('range', 'ensure this value is between ' + min_value + ' and ' + max_value));
        } else {
            callback();
        }

    };
};

exports.MinLength = function (limit_value) {
    return function (value, callback) {
        if (value.length < limit_value) {
            callback(ValidationError('min_length', 'ensure this value has at least ' + limit_value + ' characters'));
        } else {
            callback();
        }

    };
};

exports.MaxLength = function (limit_value) {
    return function (value, callback) {
        if (value.length > limit_value) {
            callback(ValidationError('max_length', 'ensure this value has no more than ' + limit_value + ' characters'));
        } else {
            callback();
        }

    };
};

exports.LengthRange = function (min_value, max_value) {
    return function (value, callback) {
        if (value.length < min_value || value.length > max_value) {
            callback(ValidationError('length_range', 'ensure this value is between ' + min_value + ' and ' + max_value + ' characters long'));
        } else {
            callback();
        }

    };
};

exports.RegExp = function (re) {
    re = (typeof re === 'string') ? new RegExp(re) : re;
    return function (value, callback) {
        if (!re.test(value)) {
            callback(ValidationError('invalid', 'enter a valid value'));
        } else {
            callback();
        }

    };
};

exports.EMail = function () {
    // regular expression by Scott Gonzalez:
    // http://projects.scottsplayground.com/email_address_validation/
    return exports.regexp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, 'please enter a valid email address');
};

exports.Url = function () {
    // regular expression by Scott Gonzalez:
    // http://projects.scottsplayground.com/iri/
    return exports.regexp(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, 'please enter a valid URL');
};
