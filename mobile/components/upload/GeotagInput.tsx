import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';

interface Geotag {
  city: string;
  lat: number;
  lng: number;
}

interface GeotagInputProps {
  onGeotagChange: (geotag: string | null) => void;
}

export default function GeotagInput({ onGeotagChange }: GeotagInputProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [geotag, setGeotag] = useState<Geotag | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      setIsLoading(false);
      return;
    }

    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Reverse geocode to get the city
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const city = reverseGeocode[0].city || 'Unknown City';
        const newGeotag = {
          city,
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude,
        };
        setGeotag(newGeotag);
        onGeotagChange(JSON.stringify(newGeotag));
      }
    } catch (error) {
        setErrorMsg("Failed to fetch location. Please ensure GPS is enabled.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleRemoveLocation = () => {
    setLocation(null);
    setGeotag(null);
    onGeotagChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ad Location (Optional)</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : geotag ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {geotag.city}</Text>
          <Button title="Remove" onPress={handleRemoveLocation} color="#ff6347" />
        </View>
      ) : (
        <Button title="Add Current Location" onPress={handleGetLocation} />
      )}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  locationText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
