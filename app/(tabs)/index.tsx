import Fontisto from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const API_KEY = '887180522e7f510be28eaa76ab28fa76';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const icons = {
  Clouds: 'cloudy',
  Clear: 'sunny',
  Rain: 'rainy',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Drizzle: 'rains',
  Thunderstorm: 'lightning',
};

export default function App() {
  const [city, setCity] = useState<string | null>('Loading...');
  const [days, setDays] = useState([]);
  const [isOk, setIsOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setIsOk(false);
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync({ latitude, longitude });
    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    setDays(data.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        {isOk ? <Text style={styles.cityName}>{city}</Text> : <Text>Location permission denied</Text>}
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          days.map((day, idx) => (
            <View key={idx} style={styles.day}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 80,
                }}
              >
                <View>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                </View>
                <Fontisto name={icons[day.weather[0].main]} size={60} color="gray" />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 40,
    fontWeight: '500',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: { fontSize: 150, fontWeight: '600' },
  description: { fontSize: 30, marginTop: -10, color: 'gray' },
  tinyText: { fontSize: 15, color: 'gray' },
});
