import pdfSchema from "../../models/web_models/pdfSchema.js";

export const UploadFile = async (req, res) => {
    try {
        // console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ status: "error", message: "No file uploaded" });
        }

        const title = req.body.title;
        const fileName = req.file.originalname; // Use original filename

        // console.log(title,fileName);
        await pdfSchema.create({ title: title, pdf: fileName });

        res.json({ status: "ok", message: "File uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const getFile = async (req, res) => {
    try {
      const { id } = req.query; // Get the 'id' from request query
  
    //   console.log(id);
      if (!id) {
        return res.status(400).json({ status: "error", message: "ID is required" });
      }
  
      // Find files where filename starts with the given 'id'
      const files = await pdfSchema.find({
        title: new RegExp(`^${id}_`) // Regex to match files starting with 'id_'
      });
  
      res.json({ status: "ok", data: files });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  };
  