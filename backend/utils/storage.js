const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();

const sasToken = process.env.MICROSOFT_AZURE_BLOB_SAS;
const storageAccountName = "pocketwise"

async function uploadToBlobStorage(blobName,buffer,containerName) {
    const sas = `https://${storageAccountName}.blob.core.windows.net/container?${sasToken}`;
    const blobServiceClient = new BlobServiceClient(sas);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer);
    console.log(`${blobName} upload sucessfully to blob storage`);
    return `https://${storageAccountName}.blob.core.windows.net/container/${containerName}/${blobName}`;
}

async function uploadImageToStorage(blobName,buffer){
    return await uploadToBlobStorage(blobName,buffer,"image");
}

module.exports = { uploadImageToStorage };