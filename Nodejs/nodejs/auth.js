const cookie = require("cookie");

exports.IsOwner = function IsOwner(req, res) {
    let isOwner = false;
    let cookies = {};

    if (req.headers.cookie) {
        cookies = cookie.parse(req.headers.cookie);
    }
    if (cookies.email === "hannah28@gmail.com" && cookies.password === "0000") {
        isOwner = true;
    } 
    return isOwner;
}

exports.AuthStatusUI = function AuthStatusUI(req, res) {
    let authStatusUI = `<a href="/login">Login</a>`
    if (req.app.get("isOwner")) {
        authStatusUI = `<a href="/logout">Logout</a>`
    }
    return authStatusUI;
}

