const fileTypeModel = require("../models/fileTypeModel");

exports.getAllFileTypes = async (req, res) => {
    try {
        const fileTypes = await fileTypeModel.getAllFileTypes();
        res.status(200).json({ status: 200, data: fileTypes, message: "Danh sách các loại file đã được lấy thành công!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Lỗi khi lấy danh sách các loại file" });
    }
};

exports.createFileType = async (req, res) => {
    const { type, spso_ID } = req.body;

    try {
        await fileTypeModel.createFileType(type, spso_ID);
        res.status(201).json({ status: 201, message: "Loại file mới đã được thêm thành công!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Lỗi khi thêm loại file mới" });
    }
};

exports.deleteFileType = async (req, res) => {
    const { type } = req.params;

    try {
        await fileTypeModel.deleteFileType(type);
        res.status(200).json({ status: 200, message: "Loại file đã được xóa thành công!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Lỗi khi xóa loại file" });
    }
};

exports.validateFileType = async (req, res) => {
    const { type } = req.body;

    try {
        const isValid = await fileTypeModel.isFileTypeValid(type);
        if (!isValid) {
            return res.status(400).json({ status: 400, message: "Loại file không được phép" });
        }
        res.status(200).json({ status: 200, message: "Loại file hợp lệ!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Lỗi khi kiểm tra loại file" });
    }
};

