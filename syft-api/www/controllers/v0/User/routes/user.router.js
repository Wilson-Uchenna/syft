"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const item = await User_1.User.findByPk(id);
    res.send(item);
});
exports.UserRouter = router;
