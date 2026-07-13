
function getTimeOfDay(date = new Date()) {
    const hour = date.getHours();

    if (hour >= 8 && hour < 12) {
        return 'Morning Peak';
    } else if (hour >= 12 && hour < 17) {
        return 'Afternoon';
    } else if (hour >= 17 && hour < 21) {
        return 'Evening Peak';
    } else {
        return 'Night';
    }
}

function getDayOfWeek(date = new Date()) {
    const day = date.getDay();
    
    if (day === 0 || day === 6) {
        return 'Weekend';
    }
    return 'Weekday';
}

async function getLiveWeatherCondition() {
    const LAT = 28.6139;
    const LON = 77.2090;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=Asia%2FKolkata`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        const weatherCode = data.current.weather_code;
        const temperature = data.current.temperature_2m;

        if (temperature >= 40.0) {
            return 'Heatwave';
        }
        if (weatherCode >= 0 && weatherCode <= 3) {
            return 'Clear';
        }
        if (weatherCode === 45 || weatherCode === 48) {
            return 'Fog';
        } 
        if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
            return 'Rain';
        }
        return 'Clear';
    } catch (error) {
        return 'Clear'; 
    }
}


export async function predict(startArea, endArea, distanceKm) {
    try {
        const weather = await getLiveWeatherCondition();
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                start_area: startArea,
                end_area: endArea,
                distance_km: distanceKm,
                time_of_day: getTimeOfDay(),
                day_of_week: getDayOfWeek(),
                weather_condition: weather,
                road_type: "Main Road"
            })
        });

        if (!response.ok) {
            throw new Error(`Prediction failed with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("time:", result);
        
        return result.predicted_travel_time_minutes;

    } catch (error) {
        console.error("Error fetching prediction:", error);
        throw error;
    }
}