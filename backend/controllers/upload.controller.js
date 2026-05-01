
export const uploadFile = (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        res.json({
            fileUrl,
            fileType: req.file.mimetype
        });
    } catch (error) {
        res.status(500).json({ message: "File upload failed" });    
    }
}