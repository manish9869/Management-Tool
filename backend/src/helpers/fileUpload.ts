import { IncomingForm } from "formidable";
import * as path from "path";
import * as fs from "fs";
import Messages from "../common/constants";
import * as ResponseHandler from "../helpers/response.handler";
import { FILE_FOLDERS } from "../common/common";
const host = process.env.SERVER_URL;
export const uploadFile = async (req, res) => {
  try {
    const form = new IncomingForm({
      uploadDir: path.join(__dirname, `./../../../${FILE_FOLDERS.CASE_FILES}`),
      keepExtensions: true,
      multiples: true,
    });

    const uploadedFiles = []; // Array to store uploaded file names

    form.on("fileBegin", (name, file) => {
      const ext = path.extname(file.originalFilename);
      file.path = `${file.path}${ext}`;
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.locals.errors = err.message;
        return ResponseHandler.JSONERROR(req, res);
      }

      // Iterate through each key in 'files' object
      Object.keys(files).forEach((fileKey) => {
        const fileList = files[fileKey]; // Get the array of files for the key

        if (!Array.isArray(fileList)) {
          // Skip if it's not an array
          return;
        }

        // Iterate through each file in the array
        fileList.forEach((file) => {
          uploadedFiles.push({
            fileName: file.newFilename,
            filePath: `${FILE_FOLDERS.CASE_FILES}`,
            url: `${host}/images/${file.newFilename}`,
          });
        });
      });

      res.locals.data = {
        files: uploadedFiles,
      };
      res.locals.message = Messages.UPLOADED;
      return ResponseHandler.JSONSUCCESS(req, res);
    });
  } catch (e) {
    res.locals.errors = e.message;
    return ResponseHandler.JSONERROR(req, res);
  }
};
export const deleteFile = async (req, res) => {
  try {
    const { imageName } = req.params;

    const filePath = path.join(
      __dirname,
      `./../../../${FILE_FOLDERS.CASE_FILES}/${imageName}`
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file from the server

      res.locals.message = Messages.DELETED;
      return ResponseHandler.JSONSUCCESS(req, res);
    } else {
      res.locals.errors = Messages.NO_FILE_UPLOADED;
      return ResponseHandler.JSONERROR(req, res);
    }
  } catch (e) {
    throw new Error(Messages.SOMETHING_WENT_WRONG);
  }
};
