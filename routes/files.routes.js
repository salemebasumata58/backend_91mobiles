const express = require("express");
const multer = require("multer");
const File = require("../models/files.model");

const app = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./files");
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
 
  
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          "only upload files with pdf, doc, docx, xslx, xls format."
        )
      );
    }
    console.log('hello');
    cb(undefined, true); // continue with upload
  },
});

app.post("/upload",upload.single("file"),async (req, res) => {
    console.log("yes");
    try {
      const { title } = req.body;
      const { path, mimetype } = req.file;
      const file = new File({
        title,
        file_path: path,
        file_mimetype: mimetype,
      });
      await file.save();
      res.status(201).send(file);
    } catch (error) {
      res.status(400).send("Error while uploading file. Try again later.");
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);
app.get('/search/:id', async (req, res) => {
    const title = await File.findOne(req.params.id);
    // console.log(req.body);
    try {
      const file = await File.findOne(title);
     
    return  res.send(file);
    } catch (error) {
      res.status(400).send('Error while getting list of files. Try again later.');
    }
  });
app.get('/allfiles', async (req, res) => {
    try {
      const files = await File.find({});
      const sortedByCreationDate = files.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      res.send(sortedByCreationDate);
    } catch (error) {
      res.status(400).send('Error while getting list of files. Try again later.');
    }
  });
  

  
  app.delete('/deletefile/:id', async (req, res) => {

    try {
    const file = await File.findByIdAndDelete(req.params.id);
    res.set({
      'Content-Type': file.file_mimetype
    });
    res.send("file is deleted")
    // res.(path.join(__dirname, '..', file.file_path));
  } catch (error) {
    res.status(400).send('Error while downloading file. Try again later.');
  }
  });
module.exports = app;
