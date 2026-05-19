import * as ImagePicker from 'expo-image-picker';

export async function pickImage() {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error(
      'Gallery permission denied'
    );
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        ImagePicker.MediaTypeOptions.Images,

      allowsEditing: true,

      quality: 0.7,
    });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}