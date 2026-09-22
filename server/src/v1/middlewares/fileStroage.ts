
import multer, {diskStorage} from "multer";

class FileStorage {
  

  public uploadDocs = () => {
    const storage = diskStorage({
      destination: "/temp/upload",
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
      }
    })

    const docFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
      // Allowed mime types
      const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif','image/webp', // images
        'application/pdf', // PDF
        'application/msword', // DOC
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only image and document files are allowed!'));
      }
    }

    const uploadDocs = multer({
      storage,
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter:docFilter
    })

    return uploadDocs.fields([
      { name: "selfie", maxCount: 1 },
      { name: "proof_id", maxCount: 1 },
      { name: "proof_address", maxCount: 1 }
    ])
  }
}

export default FileStorage;