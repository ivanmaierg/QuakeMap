import { getEarthquakes } from './queries/earthquakes';

async function testFilter() {
  try {
    console.log('Testing magnitude filter...');
    
    const result = await getEarthquakes({ minMagnitude: 5.0 });
    console.log('Filtered earthquakes count:', result.length);
    console.log('First earthquake magnitude:', result[0]?.magnitude);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testFilter();
