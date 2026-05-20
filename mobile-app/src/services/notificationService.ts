import * as Notifications from 'expo-notifications';

import * as Device from 'expo-device';

import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    alert(
      'Must use physical device for notifications'
    );

    return;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus =
    existingStatus;

  if (
    existingStatus !== 'granted'
  ) {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert(
      'Notification permission denied'
    );

    return;
  }

  const token =
    (
      await Notifications.getExpoPushTokenAsync()
    ).data;

  console.log(
    'Expo Push Token:',
    token
  );

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(
      'default',
      {
        name: 'default',
        importance:
          Notifications.AndroidImportance.MAX,
      }
    );
  }

  return token;
}

export async function sendLocalNotification(
  title: string,
  body: string
) {
  await Notifications.scheduleNotificationAsync(
    {
      content: {
        title,
        body,
      },

      trigger: null,
    }
  );
}