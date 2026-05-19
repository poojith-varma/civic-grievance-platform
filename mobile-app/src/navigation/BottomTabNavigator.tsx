import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Ionicons,
} from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CreateComplaintScreen from '../screens/CreateComplaintScreen';
import ComplaintListScreen from '../screens/ComplaintListScreen';
import ComplaintMapScreen from '../screens/ComplaintMapScreen';

const Tab =
  createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          '#007bff',

        tabBarInactiveTintColor:
          '#777',

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarIcon: ({
          color,
          size,
        }) => {
          let iconName: any;

          if (
            route.name ===
            'HomeTab'
          ) {
            iconName = 'home';
          } else if (
            route.name ===
            'ComplaintsTab'
          ) {
            iconName =
              'document-text';
          } else if (
            route.name ===
            'CreateTab'
          ) {
            iconName =
              'add-circle';
          } else if (
            route.name ===
            'MapTab'
          ) {
            iconName = 'map';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="ComplaintsTab"
        component={
          ComplaintListScreen
        }
        options={{
          title: 'Complaints',
        }}
      />

      <Tab.Screen
        name="CreateTab"
        component={
          CreateComplaintScreen
        }
        options={{
          title: 'Create',
        }}
      />

      <Tab.Screen
        name="MapTab"
        component={
          ComplaintMapScreen
        }
        options={{
          title: 'Map',
        }}
      />
    </Tab.Navigator>
  );
}