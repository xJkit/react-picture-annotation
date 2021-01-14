import React from "react";
import DeleteButton from "./DeleteButton";
export default (function (_a) {
    var value = _a.value, onChange = _a.onChange, onDelete = _a.onDelete, _b = _a.placeholder, placeholder = _b === void 0 ? "INPUT TAG HERE" : _b;
    return (React.createElement("div", { className: "rp-default-input-section" },
        React.createElement("input", { className: "rp-default-input-section_input", placeholder: placeholder, value: value, onChange: function (e) { return onChange(e.target.value); } }),
        React.createElement("a", { className: "rp-default-input-section_delete", onClick: function () { return onDelete(); } },
            React.createElement(DeleteButton, null))));
});
//# sourceMappingURL=DefaultInputSection.js.map