const documentModel = require('../models/documentModel');

// Lấy tất cả tài liệu
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await documentModel.getAllDoc();
        res.status(200).json({ status: 200, data: documents, message: "Successfully Retrieved Documents!" });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ status: 500, message: 'Error Retrieving Documents' });
    }
};

// Tạo tài liệu mới
exports.createDocument = async (req, res) => {
    try {
        const { config_ID, name, size, lastModifiedDate } = req.body;
        const newDocument = await documentModel.createNewDoc(config_ID, name, size, lastModifiedDate);
        res.status(200).json({ status: 200, data: newDocument, message: "Successfully Created Document!" });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ status: 500, message: 'Error Creating Document' });
    }
};

// Cập nhật tài liệu
exports.updateDocument = async (req, res) => {
    try {
        const { config_ID, name } = req.params;
        const updates = req.body;
        const updatedDocument = await documentModel.updateDoc(config_ID, name, updates);
        res.status(200).json({ status: 200, data: updatedDocument, message: "Successfully Updated Document!" });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ status: 500, message: 'Error Updating Document' });
    }
};

// Xóa tài liệu
exports.deleteDocument = async (req, res) => {
    try {
        const { config_ID, name } = req.params;
        const deletedDocument = await documentModel.deleteDoc(config_ID, name);
        res.status(200).json({ status: 200, data: deletedDocument, message: "Successfully Deleted Document!" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ status: 500, message: 'Error Deleting Document' });
    }
};
