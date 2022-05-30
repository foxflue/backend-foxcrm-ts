"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAddressSchema = void 0;
const yup_1 = require("yup");
exports.userAddressSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        addressLine1: (0, yup_1.string)().required("addressLine1 is required."),
        addressLine2: (0, yup_1.string)().required("addressLine1 is required."),
        city: (0, yup_1.string)().required("City is required."),
        state: (0, yup_1.string)().required("State is required."),
        zipcode: (0, yup_1.number)().required("Zip code is required."),
    }),
});
