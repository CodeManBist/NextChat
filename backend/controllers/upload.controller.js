
export const uploadFile = (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        let fileType = "file";

        if(req.file.mimetype.startsWith("image/")) {
            fileType = "image";
        } else if(req.file.mimetype.startsWith("video/")) {
            fileType = "video";
        } else if(req.file.mimetype.startsWith("audio/")) {
            fileType = "audio";
        }

        res.json({
            fileUrl,
            fileType,
            mimetype: req.file.mimetype,
        });
    } catch (error) {
        res.status(500).json({ message: "File upload failed" });    
    }
}