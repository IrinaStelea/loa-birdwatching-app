//server-side validation for registration & login forms
exports.validateForm = (req, res, next) => {
    let errorMessage = ``;

    if (req.body.firstName !== undefined && req.body.firstName.length === 0) {
        errorMessage += "Please provide a first name \n";
    }

    if (req.body.lastName !== undefined && req.body.lastName.length === 0) {
        errorMessage += "Please provide a last name \n";
    }

    let lastAtPos = req.body.email.lastIndexOf("@");
    let lastDotPos = req.body.email.lastIndexOf(".");

    if (
        !(
            lastAtPos < lastDotPos &&
            lastAtPos > 0 &&
            req.body.email.indexOf("@@") == -1 &&
            lastDotPos > 2 &&
            req.body.email.length - lastDotPos > 2
        )
    ) {
        errorMessage += "Please provide a valid email \n";
    }

    if (req.body.password.length < 6) {
        errorMessage += "Password must be 6 or more characters \n";
    }

    if (errorMessage.length > 0) {
        return res.json({
            success: false,
            message: errorMessage,
        });
    } else {
        next();
    }
};
