"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const AppError_utils_1 = require("../utils/AppError.utils");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError_utils_1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    // console.log(err);
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError_utils_1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => Object(el).message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new AppError_utils_1.AppError(message, 400);
};
const handleJWTError = () => new AppError_utils_1.AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new AppError_utils_1.AppError("Your token has expired! Please log in again.", 401);
const sendErrorDev = (err, req, res) => {
    // A) API
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
    // B) RENDERED WEBSITE
    // console.error("ERROR 💥", err);
    // return res.status(err.statusCode).render("error", {
    //   title: "Something went wrong!",
    //   msg: err.message,
    // });
};
const sendErrorProd = (err, req, res) => {
    // A) API
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // console.log(err);
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    // console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
    });
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res, next);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({}, err);
        error.message = err.message;
        if (error.name === "CastError")
            error = handleCastErrorDB(error, req, res, next);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error, req, res, next);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error, req, res, next);
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        if (err.name === "ValidationError") {
            return res.status(422).json({
                status: err.status,
                error: err,
                message: err.message,
            });
        }
        sendErrorProd(error, req, res, next);
    }
};
exports.globalErrorHandler = globalErrorHandler;
