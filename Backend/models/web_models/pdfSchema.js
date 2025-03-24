import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    pdf: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Pdf", pdfSchema);
