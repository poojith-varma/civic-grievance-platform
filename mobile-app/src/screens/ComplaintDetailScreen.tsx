import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  route: {
    params: {
      complaint: any;
    };
  };
};

export default function ComplaintDetailScreen({
  route,
}: Props) {
  const { complaint } =
    route.params;

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {complaint.title}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {complaint.status ||
                'pending'}
            </Text>
          </View>

          {complaint.image_url && (
            <Image
              source={{
                uri:
                  complaint.image_url,
              }}
              style={styles.image}
            />
          )}

          <Text style={styles.label}>
            Description
          </Text>

          <Text
            style={styles.description}
          >
            {complaint.description}
          </Text>

          <Text style={styles.label}>
            Created At
          </Text>

          <Text style={styles.date}>
            {formatDate(
              complaint.created_at
            )}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 3,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },

  statusText: {
    color: '#856404',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  image: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#666',
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#333',
  },

  date: {
    fontSize: 14,
    color: '#666',
  },
});