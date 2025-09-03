import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

const API_URL = 'http://<your-nextjs-server-ip>:3000/api/upload'; // Replace with your server IP

export default function VideoUploadScreen() {
  const [video, setVideo] = useState<DocumentPickerResponse | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [loading, setLoading] = useState(false);

  const selectVideo = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      setVideo(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const handleUpload = async () => {
    if (!video) {
      Alert.alert('Please select a video');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('video', {
      uri: video.uri,
      name: video.name,
      type: video.type,
    });
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cta_link', ctaLink);
    formData.append('cta_text', ctaText);
    formData.append('user_id', '<your-user-id>'); // Replace with the actual user ID

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        Alert.alert('Upload successful');
        // Reset form
        setVideo(null);
        setTitle('');
        setDescription('');
        setCtaLink('');
        setCtaText('');
      } else {
        const errorData = await response.json();
        Alert.alert('Upload failed', errorData.error);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      Alert.alert('An error occurred while uploading the video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Ad</Text>

      <Button title="Select Video" onPress={selectVideo} />
      {video && <Text>Selected: {video.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="CTA Link"
        value={ctaLink}
        onChangeText={setCtaLink}
      />
      <TextInput
        style={styles.input}
        placeholder="CTA Text"
        value={ctaText}
        onChangeText={setCtaText}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Upload" onPress={handleUpload} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
