export async function uploadImageToCloudinary(
  imageUri: string
) {
  const cloudName =
    process.env
      .EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    process.env
      .EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'complaint.jpg',
  } as any);

  formData.append(
    'upload_preset',
    uploadPreset || ''
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        'Image upload failed'
    );
  }

  return data.secure_url;
}