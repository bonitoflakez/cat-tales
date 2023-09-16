import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  CatDropComponent,
  CoinDropComponent,
  ItemDropComponent,
} from "../components/Special.components";

export default function Daily() {
  const [catData, setCatData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [adoptCatName, setAdoptCatName] = useState("");
  const [nextClaimTime, setNextClaimTime] = useState([]);
  const [dailyCoinCheck, setDailyCoinCheck] = useState([]);
  const [userCoin, setUserCoins] = useState([]);
  const [claimResponse, setClaimResponse] = useState(null);
  const [isCatDataFetched, setIsCatDataFetched] = useState(false);
  const [isCatNameModalOpen, setIsCatNameModalOpen] = useState(false);
  const [isInsufficientCoins, setIsInsufficientCoins] = useState(false);
  const [isInsufficientCoinsForCatto, setIsInsufficientCoinsForCatto] =
    useState(false);

  const userLocalData = JSON.parse(localStorage.getItem("userData"));

  const username = userLocalData?.user_name;
  const user_id = userLocalData?.user_id;
  const user_token = userLocalData?.user_token;

  const openCatNameModal = () => {
    setIsCatNameModalOpen(true);
  };

  const closeCatNameModal = () => {
    setIsCatNameModalOpen(false);
  };

  const fetchData = useCallback(async () => {
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
  }, [user_id, user_token, username]);

  const handleClaimDailyReward = async () => {
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

      await fetchData();

      setClaimResponse(claimResponse.data);
    } catch (error) {
      console.error("Error while claiming daily reward", error);
    }
  };

  const handleCatDataFetching = async () => {
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

      await fetchData();

      setIsCatDataFetched(true);
      setCatData(fetchCatto.data);
    } catch (error) {
      console.error("Error while fetching cat data:", error);
    }
  };

  const handleAdoptCatWithName = async () => {
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

  const fetchItemData = async () => {
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

      await fetchData();

      setItemData(itemDataresponse.data);
    } catch (error) {
      console.error("Error while fetching item data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username, fetchData]);

  return (
    <>
      <div className="drop-container grid grid-cols-3 gap-2 m-4">
        <div className="fixed top-0 right-0 p-4 m-4 bg-neutral-800 text-white text-md font-semibold border drop-shadow-md rounded-lg">
          <p>Coins: {userCoin}</p>
        </div>
        <div className="item-drop border rounded-md p-2">
          <ItemDropComponent
            itemData={itemData}
            fetchItemData={fetchItemData}
            isInsufficientCoins={isInsufficientCoins}
          />
        </div>
        <div className="cat-drop border rounded-md p-2">
          <CatDropComponent
            isCatDataFetched={isCatDataFetched}
            catData={catData}
            handleAdoptCatWithName={handleAdoptCatWithName}
            handleCatDataFetching={handleCatDataFetching}
            openCatNameModal={openCatNameModal}
            isCatNameModalOpen={isCatNameModalOpen}
            adoptCatName={adoptCatName}
            setAdoptCatName={setAdoptCatName}
            closeCatNameModal={closeCatNameModal}
            isInsufficientCoinsForCatto={isInsufficientCoinsForCatto}
          />
        </div>
        <div className="coin-drop border rounded-md p-2">
          <CoinDropComponent
            dailyCoinCheck={dailyCoinCheck}
            handleClaimDailyReward={handleClaimDailyReward}
            claimResponse={claimResponse}
            nextClaimTime={nextClaimTime}
          />
        </div>
      </div>
    </>
  );
}
