import React, { useMemo, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import MapView, { Circle, Marker, type Region } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { ReminderLocation } from '../types/models';
import { Screen } from '../components/Screen';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { TextField } from '../components/TextField';
import { useApp } from '../context/AppContext';
import { campusPlaces } from '../data/seed';
import { getCurrentCoordinates, searchCampusPlaces } from '../services/locationService';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationReminder'>;

const radii = [100, 300, 500, 1000];

export function LocationReminderScreen({ navigation }: Props) {
  const { theme, selectedLocation, setSelectedLocation } = useApp();
  const [query, setQuery] = useState('');
  const defaultLocation: ReminderLocation = campusPlaces[0] ?? {
    id: 'campus-library',
    placeName: 'Campus Library',
    address: 'Main campus library',
    latitude: -37.7213,
    longitude: 145.0489,
    radiusMeters: 300
  };

  const [candidate, setCandidate] = useState<ReminderLocation>(
    selectedLocation ?? defaultLocation
  );
  const places = useMemo(() => searchCampusPlaces(query), [query]);
  const region: Region = {
    latitude: candidate.latitude,
    longitude: candidate.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012
  };

  async function useCurrentLocation() {
    const coords = await getCurrentCoordinates();
    if (!coords) {
      Alert.alert('Location unavailable', 'Location permission was not granted. You can still select a campus place manually.');
      return;
    }
    setCandidate({
      id: 'current-location',
      placeName: 'Current location',
      address: 'Detected from device GPS',
      latitude: coords.latitude,
      longitude: coords.longitude,
      radiusMeters: 300
    });
  }

  function save() {
    setSelectedLocation(candidate);
    navigation.goBack();
  }

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Button title="←" variant="ghost" onPress={() => navigation.goBack()} style={{ minHeight: 42, width: 48 }} />
        <View style={{ marginLeft: 8, flex: 1 }}>
          <AppText variant="title">Location reminder</AppText>
          <AppText muted>Attach a campus place and radius to a task.</AppText>
        </View>
      </View>

      <TextField label="Search location" value={query} onChangeText={setQuery} placeholder="Library, science, city..." />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {places.map((place) => <Chip key={place.id} label={place.placeName} selected={candidate.id === place.id} onPress={() => setCandidate({ ...place, radiusMeters: candidate.radiusMeters })} />)}
      </View>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        {Platform.OS === 'web' ? (
          <View style={{ height: 260, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceMuted }}>
            <AppText variant="subtitle">Map preview</AppText>
            <AppText muted style={{ textAlign: 'center', paddingHorizontal: 22 }}>Native MapView renders on iOS and Android. Web fallback keeps the app usable.</AppText>
          </View>
        ) : (
          <MapView style={{ height: 300 }} region={region}>
            <Marker coordinate={candidate} title={candidate.placeName} description={candidate.address} />
            <Circle center={candidate} radius={candidate.radiusMeters} strokeColor={theme.primary} fillColor={theme.primarySoft} />
          </MapView>
        )}
      </Card>

      <Card>
        <AppText variant="label" style={{ marginBottom: 8 }}>Reminder radius</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {radii.map((radius) => <Chip key={radius} label={`${radius}m`} selected={candidate.radiusMeters === radius} onPress={() => setCandidate({ ...candidate, radiusMeters: radius })} />)}
        </View>
        <AppText variant="bodyStrong">{candidate.placeName}</AppText>
        <AppText muted>{candidate.address}</AppText>
        <Button title="Use current GPS location" variant="secondary" onPress={() => void useCurrentLocation()} style={{ marginTop: 14 }} />
        <Button title="Save selected location" onPress={save} style={{ marginTop: 10 }} />
      </Card>
    </Screen>
  );
}
