export default (function (len) {
    if (len === void 0) { len = 6; }
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var maxPos = chars.length;
    var id = "";
    for (var i = 0; i < len; i++) {
        id += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return id;
});
//# sourceMappingURL=randomId.js.map