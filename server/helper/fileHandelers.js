const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URLENDPOINT,
    publicKey: process.env.IK_PUBLICKEY,
    privateKey: process.env.IK_PRIVATEKEY
});

//Upload Image Files
const uploadFiles = async (imagesArray) => {
    const filePath = []
    const fileId = []
    for (const file of imagesArray) {
        const fileBuff = file?.buffer
        if (fileBuff) {
            const result = await imagekit.upload({
                file: fileBuff,//<url|base_64|binary>, //required
                fileName: file.originalname,   //required
            });
            fileId.push(result.fileId)
            filePath.push(result.filePath)
        }
    }
    return {filePath, fileId};
}

//Delete Image Files
const deleteFiles = async (imagesArray) => {
    console.log("Image Arr : ", imagesArray)
    for (const fileId of imagesArray) {
        if (fileId) {
            await imagekit.deleteFile(fileId, function (err, res) {
                if (err) console.log(err)
                else console.log(res)
            });
            // console.log("deleted fileid" , fileId)
        }
    }
    return true;
}


module.exports = {uploadFiles, deleteFiles}