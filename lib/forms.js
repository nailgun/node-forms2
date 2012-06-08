/*jslint node: true */

var async = require('async'),
    http = require('http'),
    querystring = require('querystring'),
    parse = require('url').parse;

exports.fields = require('./fields');
exports.validators = require('./validators');

exports.create = function (fields, validate) {
    var form = {
        fields: fields,
        validate: validate,

        bind: function (data) {
            var bound = {};
            bound.validate = form.validate;
            bound.fields = {};
            Object.keys(form.fields).forEach(function (k) {
                bound.fields[k] = form.fields[k].bind(data[k]);
            });
            var isValid = undefined;

            bound.clean = function (callback) {
                bound.data = {};
                bound.field_errors = {};
                bound.errors = [];

                async.forEach(Object.keys(bound.fields), function (k, callback) {
                    bound.fields[k].clean(function(errs, value) {
                        if (!errs) {
                            bound.data[k] = value;
                        } else {
                            bound.field_errors[k] = [];
                            errs.forEach(function(err) {
                                bound.field_errors[k].push(err.message);
                            });
                        }
                        callback();
                    });

                }, function () {
                    isValid = !Object.keys(bound.field_errors).length;
                    if (isValid && bound.validate) {
                        bound.validate(bound, function(err, field) {
                            if (err) {
                                if (field) {
                                    if (!bound.field_errors[field]) {
                                        bound.field_errors[field] = [err];
                                    } else {
                                        bound.field_errors[field].push(err);
                                    }
                                } else {
                                    bound.errors.push(err);
                                }
                                isValid = false;
                            }
                            callback();
                        });
                    } else {
                        callback();
                    }
                });
            };

            bound.isValid = function () {
                return isValid;
            };

            return bound;
        },

        handle: function (obj, callbacks) {
            if (typeof obj === 'undefined' || obj === null) {
                (callbacks.empty || callbacks.other)(form);
            } else if (obj instanceof http.IncomingMessage) {
                if (obj.method === 'GET') {
                    form.handle(parse(obj.url, 1).query, callbacks);
                } else if (obj.method === 'POST' || obj.method === 'PUT') {
                    // If the app is using bodyDecoder for connect or express,
                    // it has already put all the POST data into request.body.
                    if (obj.body) {
                        form.handle(obj.body, callbacks);
                    } else {
                        var buffer = '';
                        obj.addListener('data', function (chunk) {
                            buffer += chunk;
                        });
                        obj.addListener('end', function () {
                            form.handle(querystring.parse(buffer), callbacks);
                        });
                    }
                } else {
                    throw new Error('Cannot handle request method: ' + obj.method);
                }
            } else if (typeof obj === 'object') {
                var bound = form.bind(obj);
                bound.clean(function () {
                    if (bound.isValid()) {
                        (callbacks.success || callbacks.other)(bound);
                    } else {
                        (callbacks.error || callbacks.other)(bound);
                    }
                });
            } else {
                throw new Error('Cannot handle type: ' + typeof obj);
            }
        }
    };
    return form;
};
