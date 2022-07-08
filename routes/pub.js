const express = require("express");
const { pubController } = require("../controllers");
const router = express.Router();
const authenticatedMiddleware = require("../middlewares/authenticatedMiddleware");
const multer = require("multer");
var storage = multer.diskStorage({
  filename: function (req, file, cb) {
    let str = file.mimetype;
    const file_name = str.substring(str.lastIndexOf("/") + 1);
    console.log(file_name);
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ dest: "img/", storage: storage });

router.get("/", authenticatedMiddleware, pubController.getAll);
router.get("/:idPub/comments", authenticatedMiddleware, pubController.getComments);
router.get("/:idPub/like", authenticatedMiddleware, pubController.like);

router.post("/", authenticatedMiddleware, upload.single("avatar"), pubController.send);

module.exports = router;
