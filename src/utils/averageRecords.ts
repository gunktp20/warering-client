interface Record {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface AveragedResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function averageRecords(
  records: Record[],
  desiredLength: number,
  payload_key: string
): AveragedResult {
  if (records.length <= desiredLength) {
    // If the records length is less than or equal to the desired length, no need to average
    return {
      averagedTimeStamps: records.map((record) => record.timestamps),
      averagedVals: records.map((record) => record[payload_key]),
    };
  }

  const chunkSize = Math.ceil(records.length / desiredLength);
  const averagedTimeStamps: string[] = [];
  const averagedVals: number[] = [];

  for (let i = 0; i < records.length; i += chunkSize) {
    console.log(i);
    const chunk = records.slice(i, i + chunkSize);
    const averagedTimeStamp = chunk[chunk.length - 1].timestamps; // Median timeStamp for chunk
    const averagedVal =
      chunk.reduce((sum, record) => sum + Number(record[payload_key]), 0) /
      chunk.length;
    averagedTimeStamps.push(averagedTimeStamp);
    averagedVals.push(averagedVal);
  }

  return { averagedTimeStamps, averagedVals };
}

export default averageRecords;
