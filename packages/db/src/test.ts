import { getEarthquakes, getEarthquakeStats } from './queries/earthquakes';

async function test() {
  try {
    console.log('Testing database queries...');
    
    const stats = await getEarthquakeStats();
    console.log('Stats:', stats);
    
    const earthquakes = await getEarthquakes({ limit: 5 });
    console.log('Earthquakes count:', earthquakes.length);
    console.log('First earthquake:', earthquakes[0]);
    
    const limited = await getEarthquakes({ limit: 1 });
    console.log('Limited count:', limited.length);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
