import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import dayjs from "dayjs";

interface Props {
  time: string;
  pretext?: string;
}

// TimeAgo takes a datetime string and returns a Text element that
// displays how long ago the time was. It updates every second.
export function TimeAgo(props: Props): React.ReactElement {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());

  // Update the current time every second so that the displayed times are correct.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  return (
    <Text>
      {props.pretext}
      {dayjs(props.time).from(currentTime)}
    </Text>
  );
}
