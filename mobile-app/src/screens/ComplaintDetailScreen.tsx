import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import {
  updateComplaintStatus,
} from '../services/statusService';

import {
  fetchComplaintTimeline,
} from '../services/timelineService';

import {
  uploadImageToCloudinary,
} from '../services/cloudinaryService';

import {
  fetchWorkersByArea,
  assignWorker,
} from '../services/workerService';

import {
  useRoleStore,
} from '../store/roleStore';

import {
  lightColors,
  darkColors,
} from '../theme/colors';

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
  const navigation =
    useNavigation<any>();

  const role =
    useRoleStore(
      (state) => state.role
    );

  const colorScheme =
    useColorScheme();

  const colors =
    colorScheme === 'dark'
      ? darkColors
      : lightColors;

  const [complaint, setComplaint] =
    useState(
      route.params.complaint
    );

  const [workers, setWorkers] =
    useState<any[]>([]);
  
  const [timeline, setTimeline] =
  useState<any[]>([]);

  const [
    rejectModalVisible,
    setRejectModalVisible,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState('');

  const [
    rejectionNotes,
    setRejectionNotes,
  ] = useState('');

  useEffect(() => {
    loadWorkers();
    loadTimeline();
  }, []);
  
  async function loadTimeline() {
  try {
    const data =
      await fetchComplaintTimeline(
        complaint.id
      );

    setTimeline(data);
  } catch (error) {
    console.log(error);
  }
}

  async function loadWorkers() {
    try {
      if (
        role !== 'admin'
      ) {
        return;
      }

      if (!complaint.area) {
        return;
      }

      const data =
        await fetchWorkersByArea(
          complaint.area
        );

      setWorkers(data || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAssignWorker(
    workerId: string
  ) {
    try {
      const updatedComplaint =
        await assignWorker(
          complaint.id,
          workerId
        );

      setComplaint(
        updatedComplaint
      );

      await loadTimeline();

      Alert.alert(
        'Success',
        'Worker assigned successfully'
      );
    } catch (error: any) {
      Alert.alert(
        'Assignment Failed',
        error.message
      );
    }
  }

  async function handleStatusUpdate(
    status: string,
    imageUrl?: string
  ) {
    try {
      const updatedComplaint =
        await updateComplaintStatus(
          complaint.id,
          status,
          imageUrl
        );

      setComplaint(
        updatedComplaint
      );

      await loadTimeline();

      Alert.alert(
        'Success',
        `Complaint marked as ${status}`
      );
    } catch (error: any) {
      Alert.alert(
        'Update Failed',
        error.message
      );
    }
  }

  async function handleResolved() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        !permission.granted
      ) {
        Alert.alert(
          'Permission required'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ['images'],

          quality: 0.7,
        });

      if (
        result.canceled
      ) {
        return;
      }

      const imageUri =
        result.assets[0].uri;

      const uploadedImage =
        await uploadImageToCloudinary(
          imageUri
        );

      await handleStatusUpdate(
        'verification_pending',
        uploadedImage
      );
    } catch (error: any) {
      Alert.alert(
        'Upload Failed',
        error.message
      );
    }
  }

  async function handleRejectComplaint() {
    try {
      if (!rejectionReason.trim()) {
        Alert.alert(
          'Reason Required',
          'Please enter rejection reason'
        );

        return;
      }

      const updatedComplaint =
        await updateComplaintStatus(
          complaint.id,
          'rejected',
          undefined,
          rejectionReason,
          rejectionNotes
        );

      setComplaint(
        updatedComplaint
      );

      await loadTimeline();

      setRejectModalVisible(false);

      setRejectionReason('');
      setRejectionNotes('');

      Alert.alert(
        'Complaint Rejected'
      );
    } catch (error: any) {
      Alert.alert(
        'Rejection Failed',
        error.message
      );
    }
  }

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleString();
  }

  function getStatusData(
    status: string
  ) {
    switch (status) {
      case 'resolved':
        return {
          label: 'Resolved',
          colors: [
            '#22C55E',
            '#4ADE80',
          ],
          icon:
            'checkmark-circle',
        };

      case 'assigned':
        return {
          label:
            'Worker Assigned',
          colors: [
            '#6366F1',
            '#818CF8',
          ],
          icon: 'people',
        };

      case 'in_progress':
        return {
          label: 'In Progress',
          colors: [
            '#3B82F6',
            '#60A5FA',
          ],
          icon: 'construct',
        };

      case 'verification_pending':
        return {
          label:
            'Verification Pending',
          colors: [
            '#F59E0B',
            '#FBBF24',
          ],
          icon:
            'shield-checkmark',
        };

      case 'rejected':
        return {
          label: 'Rejected',
          colors: [
            '#EF4444',
            '#F87171',
          ],
          icon:
            'close-circle',
        };

      default:
        return {
          label: 'Pending',
          colors: [
            '#4F7CFF',
            '#7BA7FF',
          ],
          icon:
            'alert-circle',
        };
    }
  }

  const statusData =
    getStatusData(
      complaint.status
    );

  const isLocked =
  complaint.status ===
    'resolved' ||
  complaint.status ===
    'verification_pending';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* HERO */}
        <LinearGradient
          colors={
            statusData.colors
          }
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={styles.heroCard}
        >
          <View
            style={
              styles.heroTop
            }
          >
            <View
              style={
                styles.heroIcon
              }
            >
              <Ionicons
                name={
                  statusData.icon as any
                }
                size={28}
                color="#fff"
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 14,
              }}
            >
              <Text
                style={
                  styles.heroLabel
                }
              >
                Civic Complaint
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                {
                  complaint.title
                }
              </Text>
            </View>
          </View>

          <View
            style={
              styles.statusChip
            }
          >
            <Text
              style={
                styles.statusChipText
              }
            >
              {
                statusData.label
              }
            </Text>
          </View>

          <Text
            style={
              styles.heroDate
            }
          >
            {formatDate(
              complaint.created_at
            )}
          </Text>
        </LinearGradient>

        {/* AREA */}
        {complaint.area && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Area Cluster
            </Text>

            <View
              style={
                styles.areaContainer
              }
            >
              <Ionicons
                name="location"
                size={22}
                color="#4F7CFF"
              />

              <Text
                style={
                  styles.areaText
                }
              >
                {
                  complaint.area
                }
              </Text>
            </View>
          </View>
        )}

        {/* REJECTION DETAILS */}
        {complaint.status ===
          'rejected' && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <LinearGradient
              colors={[
                '#EF4444',
                '#F87171',
              ]}
              style={{
                borderRadius: 24,
                padding: 20,
              }}
            >
              <View
                style={{
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="warning"
                  size={26}
                  color="#fff"
                />

                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: '700',
                    marginLeft: 10,
                  }}
                >
                  Complaint
                  Rejected
                </Text>
              </View>

              <Text
                style={{
                  color: '#fff',
                  fontWeight: '700',
                  marginBottom: 6,
                }}
              >
                Reason
              </Text>

              <Text
                style={{
                  color: '#fff',
                  marginBottom: 16,
                  lineHeight: 24,
                }}
              >
                {
                  complaint.rejection_reason
                }
              </Text>

              {complaint.rejection_notes && (
                <>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                      marginBottom: 6,
                    }}
                  >
                    Admin Notes
                  </Text>

                  <Text
                    style={{
                      color: '#fff',
                      lineHeight: 24,
                    }}
                  >
                    {
                      complaint.rejection_notes
                    }
                  </Text>
                </>
              )}
            </LinearGradient>
          </View>
        )}

        {/* ASSIGN WORKERS */}
        {role === 'admin' &&
          complaint.status !==
            'resolved' &&
          complaint.status !==
            'rejected' && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Workforce Assignment
              </Text>

              {workers.length ===
              0 ? (
                <Text
                  style={{
                    color:
                      colors.subText,
                    fontSize: 15,
                  }}
                >
                  No workers
                  available in
                  this area.
                </Text>
              ) : (
                workers.map(
                  (worker) => (
                    <TouchableOpacity
                      key={
                        worker.id
                      }
                      activeOpacity={
                        0.9
                      }
                      onPress={() =>
                        handleAssignWorker(
                          worker.id
                        )
                      }
                    >
                      <LinearGradient
                        colors={[
                          '#4F7CFF',
                          '#7BA7FF',
                        ]}
                        style={
                          styles.workerCard
                        }
                      >
                        <View
                          style={
                            styles.workerLeft
                          }
                        >
                          <View
                            style={
                              styles.workerIcon
                            }
                          >
                            <Ionicons
                              name="person"
                              size={
                                22
                              }
                              color="#fff"
                            />
                          </View>

                          <View>
                            <Text
                              style={
                                styles.workerName
                              }
                            >
                              {
                                worker.name
                              }
                            </Text>

                            <Text
                              style={
                                styles.workerArea
                              }
                            >
                              📍{' '}
                              {
                                worker.area
                              }
                            </Text>

                            <Text
                              style={
                                styles.workerTasks
                              }
                            >
                              📦 Active
                              Tasks:{' '}
                              {
                                worker.activeTasks
                              }
                            </Text>

                            <Text
                              style={
                                styles.workerStatus
                              }
                            >
                              {worker.activeTasks ===
                              0
                                ? '🟢 Available'
                                : '🟡 Busy'}
                            </Text>
                          </View>
                        </View>

                        <Ionicons
                          name="arrow-forward-circle"
                          size={28}
                          color="#fff"
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  )
                )
              )}
            </View>
          )}

        {/* REJECT COMPLAINT */}
        {role === 'admin' &&
          complaint.status !==
            'resolved' &&
          complaint.status !==
            'rejected' && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Complaint Actions
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  setRejectModalVisible(
                    true
                  )
                }
              >
                <LinearGradient
                  colors={[
                    '#EF4444',
                    '#F87171',
                  ]}
                  style={
                    styles.actionButton
                  }
                >
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Reject Complaint
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        {/* ASSIGNED */}
        {complaint.assigned_worker_id && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Assignment Status
            </Text>

            <LinearGradient
              colors={[
                '#22C55E',
                '#4ADE80',
              ]}
              style={
                styles.assignedCard
              }
            >
              <Ionicons
                name="checkmark-circle"
                size={28}
                color="#fff"
              />

              <Text
                style={
                  styles.assignedText
                }
              >
                Worker Assigned
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* IMAGE */}
        {complaint.image_url && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Complaint Image
            </Text>

            <Image
              source={{
                uri:
                  complaint.image_url,
              }}
              style={styles.image}
            />
          </View>
        )}

        {/* MAP */}
        {complaint.latitude &&
          complaint.longitude && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    colors.card,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Location
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate(
                    'ComplaintMap',
                    {
                      latitude:
                        complaint.latitude,
                      longitude:
                        complaint.longitude,
                    }
                  )
                }
              >
                <LinearGradient
                  colors={[
                    '#4F7CFF',
                    '#7BA7FF',
                  ]}
                  style={
                    styles.mapButton
                  }
                >
                  <Ionicons
                    name="location"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.mapButtonText
                    }
                  >
                    View Complaint
                    Location
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}


        {/* TIMELINE */}
<View
  style={[
    styles.card,
    {
      backgroundColor:
        colors.card,
    },
  ]}
>
  <Text
    style={[
      styles.sectionTitle,
      {
        color:
          colors.text,
      },
    ]}
  >
    📜 Complaint Timeline
  </Text>

  {timeline.length === 0 ? (
    <Text
      style={{
        color:
          colors.subText,
      }}
    >
      No timeline events yet.
    </Text>
  ) : (
    timeline.map(
      (event, index) => (
        <View
          key={event.id}
          style={{
            flexDirection:
              'row',

            marginBottom:
              index ===
              timeline.length -
                1
                ? 0
                : 24,
          }}
        >
          {/* TIMELINE LINE */}
          <View
            style={{
              alignItems:
                'center',

              marginRight: 16,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,

                borderRadius: 20,

                backgroundColor:
                  '#4F7CFF',
              }}
            />

            {index !==
              timeline.length -
                1 && (
              <View
                style={{
                  width: 2,
                  flex: 1,

                  backgroundColor:
                    '#D1D5DB',

                  marginTop: 4,
                }}
              />
            )}
          </View>

          {/* CONTENT */}
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                color:
                  colors.text,

                fontSize: 16,

                fontWeight:
                  '700',
              }}
            >
              {
                event.action
              }
            </Text>

            <Text
              style={{
                color:
                  colors.subText,

                marginTop: 4,

                fontSize: 13,
              }}
            >
              By:{' '}
              {event
                ?.profiles
                ?.name ||
                'System'}
            </Text>

            <Text
              style={{
                color:
                  colors.subText,

                marginTop: 4,

                fontSize: 13,
              }}
            >
              {new Date(
                event.created_at
              ).toLocaleString()}
            </Text>
          </View>
        </View>
      )
    )
  )}
</View>


        {/* DESCRIPTION */}
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Description
          </Text>

          <Text
            style={[
              styles.description,
              {
                color:
                  colors.subText,
              },
            ]}
          >
            {
              complaint.description
            }
          </Text>
        </View>

        {/* COMPLETION PROOF */}
        {complaint.completion_image_url && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Completion Proof
            </Text>

            <Image
              source={{
                uri:
                  complaint.completion_image_url,
              }}
              style={styles.image}
            />
          </View>
        )}

        {/* CITIZEN REOPEN */}
        {role === 'citizen' &&
          complaint.status ===
            'rejected' && (
            <View
              style={
                styles.actionsContainer
              }
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  handleStatusUpdate(
                    'pending'
                  )
                }
              >
                <LinearGradient
                  colors={[
                    '#4F7CFF',
                    '#7BA7FF',
                  ]}
                  style={
                    styles.actionButton
                  }
                >
                  <Ionicons
                    name="refresh-circle"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Reopen Complaint
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        {/* WORKER ACTIONS */}
        {role === 'worker' &&
          !isLocked && (
            <View
              style={
                styles.actionsContainer
              }
            >
              <TouchableOpacity
                activeOpacity={
                  0.9
                }
                onPress={() =>
                  handleStatusUpdate(
                    'in_progress'
                  )
                }
              >
                <LinearGradient
                  colors={[
                    '#3B82F6',
                    '#60A5FA',
                  ]}
                  style={
                    styles.actionButton
                  }
                >
                  <Ionicons
                    name="construct"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Mark In
                    Progress
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={
                  0.9
                }
                onPress={
                  handleResolved
                }
              >
                <LinearGradient
                  colors={[
                    '#F59E0B',
                    '#FBBF24',
                  ]}
                  style={
                    styles.actionButton
                  }
                >
                  <Ionicons
                    name="checkmark-done"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Work Is Done
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        {/* ADMIN VERIFICATION */}
        {role === 'admin' &&
          complaint.status ===
            'verification_pending' && (
            <View
              style={
                styles.actionsContainer
              }
            >
              <TouchableOpacity
                activeOpacity={
                  0.9
                }
                onPress={() =>
                  handleStatusUpdate(
                    'resolved'
                  )
                }
              >
                <LinearGradient
                  colors={[
                    '#22C55E',
                    '#4ADE80',
                  ]}
                  style={
                    styles.actionButton
                  }
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Approve &
                    Resolve
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={
                  0.9
                }
                onPress={() =>
                  handleStatusUpdate(
                    'pending'
                  )
                }
              >
                <LinearGradient
                  colors={[
                    '#EF4444',
                    '#F87171',
                  ]}
                  style={
                    styles.actionButton
                  }
                >
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.actionText
                    }
                  >
                    Reject
                    Verification
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>

      {/* REJECTION MODAL */}
      <Modal
        visible={
          rejectModalVisible
        }
        transparent
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              'rgba(0,0,0,0.5)',
            justifyContent:
              'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor:
                colors.card,
              borderRadius: 28,
              padding: 24,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 20,
              }}
            >
              Reject Complaint
            </Text>

            <TextInput
              placeholder="Rejection Reason"
              placeholderTextColor={
                colors.subText
              }
              value={
                rejectionReason
              }
              onChangeText={
                setRejectionReason
              }
              style={{
                backgroundColor:
                  colors.background,
                borderRadius: 18,
                padding: 16,
                color: colors.text,
                marginBottom: 16,
              }}
            />

            <TextInput
              placeholder="Optional Notes"
              placeholderTextColor={
                colors.subText
              }
              value={
                rejectionNotes
              }
              onChangeText={
                setRejectionNotes
              }
              multiline
              style={{
                backgroundColor:
                  colors.background,
                borderRadius: 18,
                padding: 16,
                color: colors.text,
                height: 120,
                textAlignVertical:
                  'top',
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={
                handleRejectComplaint
              }
            >
              <LinearGradient
                colors={[
                  '#EF4444',
                  '#F87171',
                ]}
                style={{
                  borderRadius: 20,
                  paddingVertical: 16,
                  alignItems:
                    'center',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  Confirm Rejection
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 16,
                alignItems:
                  'center',
              }}
              onPress={() =>
                setRejectModalVisible(
                  false
                )
              }
            >
              <Text
                style={{
                  color:
                    colors.subText,
                  fontWeight: '600',
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },

    heroCard: {
      borderBottomLeftRadius: 36,
      borderBottomRightRadius: 36,
      padding: 26,
      paddingTop: 60,
      marginBottom: 24,
    },

    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    heroIcon: {
      width: 64,
      height: 64,
      borderRadius: 22,
      backgroundColor:
        'rgba(255,255,255,0.2)',
      justifyContent:
        'center',
      alignItems:
        'center',
    },

    heroLabel: {
      color: '#EAF1FF',
      fontSize: 15,
    },

    heroTitle: {
      color: '#fff',
      fontSize: 28,
      fontWeight: '700',
      marginTop: 6,
    },

    statusChip: {
      alignSelf:
        'flex-start',
      backgroundColor:
        'rgba(255,255,255,0.2)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 30,
      marginTop: 24,
    },

    statusChipText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 13,
    },

    heroDate: {
      color: '#EAF1FF',
      marginTop: 18,
      fontSize: 13,
    },

    card: {
      marginHorizontal: 20,
      marginBottom: 22,
      borderRadius: 30,
      padding: 22,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 6,
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 18,
    },

    image: {
      width: '100%',
      height: 260,
      borderRadius: 24,
    },

    description: {
      fontSize: 16,
      lineHeight: 28,
    },

    mapButton: {
      borderRadius: 22,
      paddingVertical: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      shadowColor:
        '#4F7CFF',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },

    mapButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      marginLeft: 10,
    },

    actionsContainer: {
      paddingHorizontal: 20,
    },

    actionButton: {
      borderRadius: 24,
      paddingVertical: 18,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },

    actionText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      marginLeft: 10,
    },

    areaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    areaText: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: '700',
      color: '#4F7CFF',
    },

    workerCard: {
      borderRadius: 24,
      padding: 18,
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    workerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    workerIcon: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor:
        'rgba(255,255,255,0.2)',
      justifyContent:
        'center',
      alignItems:
        'center',
      marginRight: 14,
    },

    workerName: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '700',
    },

    workerArea: {
      color: '#EAF1FF',
      marginTop: 4,
      fontSize: 13,
    },

    workerTasks: {
      color: '#EAF1FF',
      marginTop: 4,
      fontSize: 13,
    },

    workerStatus: {
      color: '#fff',
      marginTop: 4,
      fontSize: 13,
      fontWeight: '700',
    },

    assignedCard: {
      borderRadius: 22,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
    },

    assignedText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      marginLeft: 10,
    },
  });