import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av'; // Assuming usage of Expo AV for video playback

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://your-api-url.com';

export default function VideoPlayer({ ad }) {
  const videoRef = useRef(null);
  const [overlays, setOverlays] = useState([]);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch overlays for the current ad
  useEffect(() => {
    async function fetchOverlays() {
      if (!ad.id) return;
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/overlays/${ad.id}`);
        const data = await response.json();
        setOverlays(data);
      } catch (error) {
        console.error('Failed to fetch overlays', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOverlays();
  }, [ad.id]);

  // Handle video playback status updates to show/hide overlays
  const handlePlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;

    const currentTime = status.positionMillis / 1000;
    const currentOverlay = overlays.find(
      (o) => currentTime >= o.start_time_seconds && currentTime <= o.end_time_seconds
    );
    setActiveOverlay(currentOverlay || null);
  };

  // Handle interaction with an overlay
  const handleInteraction = async (overlay, value = null) => {
    try {
      await fetch(`${API_URL}/api/overlays/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', /* Add Auth headers */ },
        body: JSON.stringify({
          overlay_id: overlay.id,
          ad_id: ad.id,
          interaction_type: overlay.type === 'cta' ? 'click' : 'vote',
          interaction_value: value,
        }),
      });
      // Optionally, you could hide the overlay after interaction
      setActiveOverlay(null);
    } catch (error) {
      console.error('Failed to record interaction', error);
    }
  };

  const renderOverlay = () => {
    if (!activeOverlay) return null;

    if (activeOverlay.type === 'cta') {
      return (
        <TouchableOpacity
          style={styles.ctaOverlay}
          onPress={() => handleInteraction(activeOverlay)}
        >
          <Text style={styles.ctaText}>{activeOverlay.config.text}</Text>
        </TouchableOpacity>
      );
    }

    if (activeOverlay.type === 'poll') {
      return (
        <View style={styles.pollOverlay}>
          <Text style={styles.pollQuestion}>{activeOverlay.config.question}</Text>
          <View style={styles.pollOptions}>
            {activeOverlay.config.options.map((option) => (
              <Button
                key={option}
                title={option}
                onPress={() => handleInteraction(activeOverlay, option)}
              />
            ))}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_CODE}.cloudflarestream.com/${ad.video_url}/manifest/video.m3u8` }}
        useNativeControls={false}
        resizeMode="cover"
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      <View style={styles.overlayContainer}>
        {isLoading ? <ActivityIndicator color="#fff" /> : renderOverlay()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaOverlay: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pollOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  pollQuestion: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  pollOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
