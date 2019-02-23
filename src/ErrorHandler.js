class ErrorHandler {
    constructor(error) {
        this.code = error.statusCode;
        this.message = error.body.message;
    }
}

module.exports = ErrorHandler;