import type {
  CloudinaryUploadResponse,
  GenerateUploadSignatureResponse,
} from "../../types/storage";

type UploadFileToCloudinaryParams = {
  file: File;
  signatureData: GenerateUploadSignatureResponse;
};

export async function uploadFileToCloudinary({
  file,
  signatureData,
}: UploadFileToCloudinaryParams): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);
  formData.append("upload_preset", signatureData.uploadPreset);
  formData.append("resource_type", "raw");

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/raw/upload`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  return data;
}