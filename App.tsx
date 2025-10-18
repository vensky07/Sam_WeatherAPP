import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import axios from "axios";

const API_KEY = "3bc9ec07f94c4413972224220250509";
const CITY = "Port-au-Prince";

export default function WeatherApp() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      const { data } = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${CITY}&days=1&aqi=no&alerts=no`
      );

      setWeather(data);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchWeather();
  }, []);

  
  if (loading)
    return (
      <CenteredView>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </CenteredView>
    );

  
  if (error)
    return (
      <CenteredView>
        <Text style={styles.error}>{error}</Text>
        <RefreshButton onPress={fetchWeather} text="Try Again" />
      </CenteredView>
    );

  
  const { current, forecast } = weather;
  const { day, astro } = forecast.forecastday[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.city}>Port-au-Prince, HT</Text>
        <Text style={styles.time}>
          As of{" "}
          {lastUpdated?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} EDT
        </Text>

        <View style={styles.tempRow}>
          <Text style={styles.temp}>{Math.round(current.temp_f)}°</Text>
          <FontAwesome5 name="cloud-sun" size={52} color="white" />
        </View>

        <Text style={styles.condition}>{current.condition.text}</Text>

        <View style={styles.highLowRow}>
          <Text style={styles.highLow}>
            Day {Math.round(day.maxtemp_f)}° • Night {Math.round(day.mintemp_f)}°
          </Text>
          <AlertBadge text="RIP CURRENT STATE... +1 MORE" />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Weather Today in Port-au-Prince, HT</Text>

        <FeelsLike temp={current.feelslike_f} />

        <SunTimes sunrise={astro.sunrise} sunset={astro.sunset} />

        {/* Info Grid */}
        <View style={styles.grid}>
          <WeatherItem icon="thermometer-half" label="High / Low" value={`${Math.round(day.maxtemp_f)}° / ${Math.round(day.mintemp_f)}°`} />
          <WeatherItem icon="wind" label="Wind" value={`↑ ${current.wind_mph} mph`} />
          <WeatherItem icon="tint" label="Humidity" value={`${current.humidity}%`} />
          <WeatherItem icon="thermometer-quarter" label="Dew Point" value={`${Math.round(current.dewpoint_f)}°`} />
          <WeatherItem icon="weight-hanging" label="Pressure" value={`${current.pressure_in} in`} />
          <WeatherItem icon="sun" label="UV Index" value={`${current.uv} of 11`} />
          <WeatherItem icon="eye" label="Visibility" value={`${current.vis_miles} mi`} />
          <WeatherItem icon="moon" label="Moon Phase" value={astro.moon_phase} />
        </View>

        <RefreshButton onPress={fetchWeather} refreshing={refreshing} />
      </View>
    </ScrollView>
  );
}



const CenteredView = ({ children }: any) => (
  <View style={styles.center}>{children}</View>
);

const WeatherItem = ({ icon, label, value }: any) => (
  <View style={styles.item}>
    <View style={styles.labelRow}>
      <FontAwesome5 name={icon} size={16} color="#64748b" />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const RefreshButton = ({ onPress, refreshing = false, text = "Refresh Data" }: any) => (
  <TouchableOpacity style={styles.refreshBtn} onPress={onPress}>
    {refreshing ? (
      <>
        <ActivityIndicator size="small" color="#fff" />
        <Text style={styles.refreshText}>Refreshing...</Text>
      </>
    ) : (
      <>
        <Ionicons name="refresh" size={18} color="#fff" />
        <Text style={styles.refreshText}>{text}</Text>
      </>
    )}
  </TouchableOpacity>
);

const AlertBadge = ({ text }: any) => (
  <View style={styles.alertBadge}>
    <View style={styles.dot} />
    <Text style={styles.alertText}>{text}</Text>
  </View>
);

const FeelsLike = ({ temp }: any) => (
  <View style={styles.feelsSection}>
    <Text style={styles.feelsLabel}>Feels Like</Text>
    <Text style={styles.feelsTemp}>{Math.round(temp)}°</Text>
  </View>
);

const SunTimes = ({ sunrise, sunset }: any) => (
  <View style={styles.sunRow}>
    <SunItem icon="sunrise" text={sunrise} />
    <SunItem icon="sunset" text={sunset} />
  </View>
);

const SunItem = ({ icon, text }: any) => (
  <View style={styles.sunItem}>
    <Feather name={icon} size={20} color="#f59e0b" />
    <Text style={styles.sunText}>{text}</Text>
  </View>
);



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingBottom: 50 },
  header: {
    backgroundColor: "#4b5563",
    padding: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  city: { color: "white", fontSize: 22, fontWeight: "700" },
  time: { color: "#e5e7eb", marginBottom: 10 },
  tempRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  temp: { color: "white", fontSize: 64, fontWeight: "300" },
  condition: { color: "#f3f4f6", fontSize: 18, marginTop: 8 },
  highLowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  highLow: { color: "#d1d5db", fontSize: 16 },
  alertBadge: {
    backgroundColor: "#64748b",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dot: { width: 6, height: 6, backgroundColor: "white", borderRadius: 3, marginRight: 6 },
  alertText: { color: "white", fontSize: 12, fontWeight: "600" },
  content: { padding: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  feelsSection: { alignItems: "center", marginBottom: 20 },
  feelsLabel: { color: "#64748b", fontSize: 14 },
  feelsTemp: { fontSize: 48, fontWeight: "300", color: "#1e293b" },
  sunRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  sunItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  sunText: { color: "#64748b" },
  grid: { marginTop: 10 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { color: "#64748b", fontSize: 14 },
  value: { color: "#1e293b", fontSize: 16, fontWeight: "600" },
  refreshBtn: {
    backgroundColor: "#8b5cf6",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 24,
    gap: 8,
  },
  refreshText: { color: "white", fontWeight: "600", fontSize: 14 },
  loadingText: { color: "#64748b", marginTop: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16, marginBottom: 20 },
});
