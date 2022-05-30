"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete Object(queryObj)[el]);
        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query = Object(this.query).find(JSON.parse(queryStr));
        return this;
    }
    search() {
        if (Object(this.queryString).search) {
            const search = Object(this.queryString).search.split(",");
            const queryObj = {};
            Object(queryObj).search[0] = { $regex: search[1], $options: "i" };
            this.query = Object(this.query).find(queryObj);
        }
        return this;
    }
    sort() {
        if (Object(this.queryString).sort) {
            const sortBy = Object(this.queryString).sort.split(",").join(" ");
            this.query = Object(this.query).sort(sortBy);
        }
        else {
            this.query = Object(this.query).sort("-created_at");
        }
        return this;
    }
    limitFields() {
        if (Object(this.queryString).fields) {
            const fields = Object(this.queryString).fields.split(",").join(" ");
            this.query = Object(this.query).select(fields);
        }
        else {
            this.query = Object(this.query).select("-__v");
        }
        return this;
    }
    paginate() {
        const page = Object(this.queryString).page * 1 || 1;
        const limit = Object(this.queryString).limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = Object(this.query).skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIFeatures;
