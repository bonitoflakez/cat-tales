export const claimTimeCalculator = (lastClaimTimeResponse) => {
  const lastClaimTime = lastClaimTimeResponse;
  const lastClaimDate = new Date(lastClaimTime);
  const resetInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const nextClaimTime = new Date(lastClaimDate.getTime() + resetInterval);

  const formatWithLeadingZero = (num) => (num < 10 ? `0${num}` : num);

  const hours = nextClaimTime.getHours();
  const minutes = nextClaimTime.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";

  const formattedHours = formatWithLeadingZero(hours > 12 ? hours - 12 : hours);
  const formattedMinutes = formatWithLeadingZero(minutes);

  const formattedNextClaimTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

  return formattedNextClaimTime;
};
