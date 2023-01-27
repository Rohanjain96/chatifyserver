const express = require("express");
const { sendMessage, getMessages, sendfile } = require("../controllers/messageController");
const { protect } = require("../Middleware/Autheticate");
const multer = require('multer');
const router = express.Router();

router.get("/:chatId", getMessages);

router.post("/sendmessage",protect, sendMessage);

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, './files');
      },
      filename(req, file, cb) {
        console.log(file)
        cb(null, `${new Date().getTime()}_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 16000000
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
        return cb(
          new Error(
            'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
          )
        );
      }
      cb(undefined, true); // continue with upload
    }
  });
  
  router.post(
    '/sendfile',
    upload.single("file"),
    protect,
    sendfile
  );

module.exports = router;
