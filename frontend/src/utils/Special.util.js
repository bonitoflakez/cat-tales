import axios from "axios";

const openCatNameModal = (setIsCatNameModalOpen) => {
  setIsCatNameModalOpen(true);
};

const closeCatNameModal = (setIsCatNameModalOpen) => {
  setIsCatNameModalOpen(false);
};

const fetchSpecialData = async (
  username,
  user_token,
  setUserCoins,
  user_id,
  setNextClaimTime,
  setDailyCoinCheck
) => {
  try {
    const userData = await axios.get(
      `http://localhost:8000/api/player/getPlayer/${username}`,
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    setUserCoins(userData.data.coins);

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

    const lastClaimTime = coinRewardCheck.data.last_claim_time;
    const lastClaimDate = new Date(lastClaimTime);
    const resetInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const nextClaimTime = new Date(lastClaimDate.getTime() + resetInterval);

    const formatWithLeadingZero = (num) => (num < 10 ? `0${num}` : num);

    const hours = nextClaimTime.getHours();
    const minutes = nextClaimTime.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    const formattedHours = formatWithLeadingZero(
      hours > 12 ? hours - 12 : hours
    );
    const formattedMinutes = formatWithLeadingZero(minutes);

    const formattedNextClaimTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

    setNextClaimTime(formattedNextClaimTime);

    setDailyCoinCheck(coinRewardCheck.data);
  } catch (error) {
    console.error("Error while fetching user details", error);
  }
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
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    await fetchSpecialData();

    setClaimResponse(claimResponse.data);
  } catch (error) {
    console.error("Error while claiming daily reward", error);
  }
};

const handleCatDataFetching = async (
  user_id,
  user_token,
  setIsInsufficientCoinsForCatto,
  setIsCatDataFetched,
  setCatData
) => {
  try {
    if (!user_id) {
      console.error("User ID is missing");
      return;
    }

    const fetchCatto = await axios.post(
      "http://localhost:8000/api/cat/drop",
      {
        user_id: user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    if (fetchCatto.data.status === "get_rich") {
      setIsInsufficientCoinsForCatto(true);

      setTimeout(() => {
        setIsInsufficientCoinsForCatto(false);
      }, 2000);
    }

    await fetchSpecialData();

    setIsCatDataFetched(true);
    setCatData(fetchCatto.data);
  } catch (error) {
    console.error("Error while fetching cat data:", error);
  }
};

const handleAdoptCatWithName = async (
  user_id,
  catData,
  adoptCatName,
  user_token
) => {
  try {
    if (!user_id) {
      console.error("User ID is missing.");
      return;
    }

    const catType = catData.catType.typeId;
    const catLevel = catData.catLevel;

    await axios.post(
      "http://localhost:8000/api/cat/adopt",
      {
        name: adoptCatName,
        type: catType,
        level: catLevel,
        user_id: user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error while adopting a cat:", error);
  } finally {
    closeCatNameModal();
  }
};

const fetchItemData = async (
  user_id,
  user_token,
  setIsInsufficientCoins,
  setItemData
) => {
  try {
    if (!user_id) {
      console.error("User ID is missing");
      return;
    }

    const itemDataresponse = await axios.post(
      "http://localhost:8000/api/item/add",
      {
        user_id: user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      }
    );

    if (itemDataresponse.data.status === "get_rich") {
      setIsInsufficientCoins(true);

      setTimeout(() => {
        setIsInsufficientCoins(false);
      }, 2000);
    }

    await fetchSpecialData();

    setItemData(itemDataresponse.data);
  } catch (error) {
    console.error("Error while fetching item data:", error);
  }
};

export {
  fetchItemData,
  handleAdoptCatWithName,
  handleClaimDailyReward,
  handleCatDataFetching,
  openCatNameModal,
  closeCatNameModal,
  fetchSpecialData
};
