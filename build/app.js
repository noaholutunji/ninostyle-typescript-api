"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
require("dotenv/config");
var user_1 = __importDefault(require("./routers/user"));
var product_1 = __importDefault(require("./routers/product"));
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(user_1.default);
app.use(product_1.default);
var URL = process.env.MONGODB_URL || '';
mongoose_1.default.connect(URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
exports.default = app;
