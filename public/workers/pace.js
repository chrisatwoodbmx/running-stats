onmessage = (e) => {
  const R = 6371e3;

  const lat1 = (e.data.lat1 * Math.PI) / 180;
  const lat2 = (e.data.lat2 * Math.PI) / 180;
  const deltaLat = ((e.data.lat2 - e.data.lat1) * Math.PI) / 180;
  const deltaLong = ((e.data.long2 - e.data.long1) * Math.PI) / 180;


  const distance = Math.sin(deltaLat / 2) * Math.sin(deltaLong / 2)
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance));

  postMessage(R * c);
};
