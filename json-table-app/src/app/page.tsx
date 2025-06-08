'use client';

import { useEffect, useState } from 'react';

type Telemetry = {
  latitude: number;
  longitude: number;
  datetime: string;
  battery: number;
};

export default function Home() {
  const [data, setData] = useState<Telemetry[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8080/view')
        .then((res) => res.json())
        .then((json) => {
          console.log('Backend response:', json);
          setData(json.telemetryData || []);
        })
        .catch((err) => console.error('Failed to fetch data:', err));
    };

    fetchData(); // initial fetch

    const intervalId = setInterval(fetchData, 3600000); // fetch every 5 seconds

    return () => clearInterval(intervalId); // cleanup on component unmount
  }, []);

  const downloadCSV = () => {
  if (!data.length) return;

  const headers = ['Latitude', 'Longitude', 'Datetime', 'Battery'];
  const rows = data.map(row => [
    row.latitude,
    row.longitude,
    row.datetime,
    row.battery,
  ]);

  const csvContent = [
    headers.join(','),             // Header row
    ...rows.map(r => r.join(','))  // Data rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'telemetry_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <main className="min-h-screen p-8">
      <button
  onClick={downloadCSV}
  className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
>
  Download CSV
</button>
      <h1 className="text-2xl font-bold mb-6">Tracking Data</h1>

      {data && data.length > 0 ? (
        <table className="table-auto border-collapse border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Latitude</th>
              <th className="border px-4 py-2">Longitude</th>
              <th className="border px-4 py-2">Datetime</th>
              <th className="border px-4 py-2">Battery (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{entry.latitude}</td>
                <td className="border px-4 py-2">{entry.longitude}</td>
                <td className="border px-4 py-2">{entry.datetime}</td>
                <td className="border px-4 py-2">{entry.battery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading or no data available...</p>
      )}
    </main>
  );
}
