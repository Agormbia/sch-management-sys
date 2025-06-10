"use client";
import Image from "next/image";
import { ResponsiveBar } from '@nivo/bar';

const data = [
  {
    name: "Mon",
    present: 60,
    absent: 40,
  },
  {
    name: "Tue",
    present: 70,
    absent: 60,
  },
  {
    name: "Wed",
    present: 90,
    absent: 75,
  },
  {
    name: "Thu",
    present: 90,
    absent: 75,
  },
  {
    name: "Fri",
    present: 65,
    absent: 55,
  },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="h-[90%]">
        <ResponsiveBar
          data={data}
          keys={['present', 'absent']}
          indexBy="name"
          margin={{ top: 50, right: 30, bottom: 50, left: 30 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          colors={['#FAE27C', '#C3EBFA']}
          borderRadius={10}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: -40,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              symbolShape: 'circle'
            }
          ]}
          role="application"
          ariaLabel="Attendance chart"
          barAriaLabel={e => e.id + ": " + e.formattedValue + " in " + e.indexValue}
        />
      </div>
    </div>
  );
};

export default AttendanceChart;
