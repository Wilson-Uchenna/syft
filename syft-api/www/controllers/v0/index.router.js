"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRouter = void 0;
const express_1 = require("express");
const feed_router_1 = require("./FeedItem/routes/feed.router");
const user_router_1 = require("./User/routes/user.router");
const auth_router_1 = require("./User/routes/auth.router");
const router = (0, express_1.Router)();
router.use('/feed', feed_router_1.FeedRouter);
router.use("/users", user_router_1.UserRouter);
router.use("/auth", auth_router_1.AuthRouter); // Assuming authRouter is part of UserRouter
router.get("/", async (req, res) => {
    res.send("V0");
});
exports.IndexRouter = router;
