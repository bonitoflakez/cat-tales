import axios from "axios";

const copyToClipboard = (user_id, setIsCopied) => {
  navigator.clipboard
    .writeText(user_id)
    .then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000); // 2 sec in ms
    })
    .catch((error) => {
      console.error("Failed to copy: ", error);
    });
};

const handleClaimDailyReward = async (
  user_id,
  dailyCoinCheck,
  user_token,
  setClaimResponse
) => {
  try {
    if (!user_id) {
      console.error("User ID is missing.");
      return;
    }

    if (dailyCoinCheck.status !== "ready_to_claim") {
      console.log("Cannot claim daily reward at this time.");
      return;
    }

    const claimResponse = await axios.post(
      "http://localhost:8000/api/daily/claim",
      {
        user_id: user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    setClaimResponse(claimResponse.data);
  } catch (error) {
    console.error("Error while claiming daily reward", error);
  }
};

const fetchDashboardData = async ({
  username,
  user_token,
  user_id,
  setUserData,
  setUserCatsData,
  setUserItemsData,
  claimTimeCalculator,
  setNextClaimTime,
  setDailyCoinCheck,
}) => {
  try {
    const userResponse = await axios.get(
      `http://localhost:8000/api/player/getPlayer/${username}`,
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    setUserData(userResponse.data);

    const catResponse = await axios.get(
      `http://localhost:8000/api/player/getPlayerCat/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );
    setUserCatsData(catResponse.data);

    const itemResponse = await axios.get(
      `http://localhost:8000/api/player/getPlayerItem/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );
    setUserItemsData(itemResponse.data);

    const coinRewardCheck = await axios.post(
      "http://localhost:8000/api/daily/check",
      {
        user_id: user_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    const lastClaimTimeResponse = coinRewardCheck.data.last_claim_time;
    const formattedNextClaimTime = claimTimeCalculator(lastClaimTimeResponse);

    setNextClaimTime(formattedNextClaimTime);
    setDailyCoinCheck(coinRewardCheck.data);
  } catch (error) {
    console.error("Error while fetching user details", error);
  }
};

export { copyToClipboard, handleClaimDailyReward, fetchDashboardData };
