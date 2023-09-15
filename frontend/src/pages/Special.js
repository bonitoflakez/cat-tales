import { useState, useEffect, useCallback } from "react";
import axios from "axios";

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
          <p>
            <strong>Item name: </strong>
            {itemData.itemName || "Nothing to display"}
          </p>
          <p>
            <strong>Item type: </strong>
            {itemData.itemType || "Nothing to display"}
          </p>
          <p>
            <strong>Item rarity: </strong>
            {itemData.itemRarity || "Nothing to display"}
          </p>
          <button
            className="border px-2 py-0.5 mt-2 rounded-md bg-neutral-900 hover:bg-neutral-800"
            onClick={fetchItemData}
          >
            Fetch an Item (Costs 500 coins)
          </button>
          {isInsufficientCoins && (
            <p className="font-bold p-2">Insufficient coins</p>
          )}
        </div>
        <div className="cat-drop border rounded-md p-2">
          {isCatDataFetched ? (
            <>
              {catData.catType ? (
                <>
                  <p>
                    <strong>Cat type: </strong>
                    {catData.catType.typeName}
                  </p>
                  <p>
                    <strong>Cat level: </strong>
                    {catData.catLevel}
                  </p>
                </>
              ) : (
                <p>
                  <strong>Cat type: </strong> Nothing to display
                  <br />
                  <strong>Cat level: </strong> Nothing to display
                </p>
              )}
            </>
          ) : (
            <p>Fetch a cat (Costs 500 coins)</p>
          )}
          {/* take cat name input */}
          <button
            className="border px-2 py-0.5 mt-2 mr-2 rounded-md bg-neutral-900 hover:bg-neutral-800"
            onClick={handleCatDataFetching}
          >
            Fetch a cat
          </button>
          <button
            className="border px-2 py-0.5 mt-2 mr-2 rounded-md bg-neutral-900 hover:bg-neutral-800"
            onClick={openCatNameModal}
          >
            Adopt
          </button>

          {isCatNameModalOpen && (
            <div className="modal-background">
              <div className="modal-content">
                <h2>Enter Cat Name</h2>
                <input
                  type="text"
                  placeholder="Enter cat name"
                  className="bg-neutral-900 border rounded-md px-1 py-0.5"
                  value={adoptCatName}
                  onChange={(e) => setAdoptCatName(e.target.value)}
                />
                <button
                  className="border px-2 py-0.5 mt-1 mx-1 rounded-md bg-neutral-900 hover:bg-neutral-800"
                  onClick={handleAdoptCatWithName}
                >
                  Adopt
                </button>
                <button
                  className="border px-2 py-0.5 mt-1 ml-1 rounded-md bg-neutral-900 hover:bg-neutral-800"
                  onClick={closeCatNameModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {isInsufficientCoinsForCatto && (
            <p className="font-bold p-2">Insufficient coins</p>
          )}
        </div>
        <div className="coin-drop border rounded-md p-2">
          <p className="next-drop-in">
            <strong>next drop will be available at:</strong> {nextClaimTime}
          </p>
          <p className="user-xp">
            <strong>daily reward claimed: </strong>
            {dailyCoinCheck.status === "already_claimed" ||
            dailyCoinCheck.status === "ready_to_claim"
              ? dailyCoinCheck.message
              : "Couldn't fetch reward status"}
          </p>
          <button
            className="claim-daily-reward border p-1 mt-2 rounded-md"
            onClick={handleClaimDailyReward}
          >
            Claim Daily Reward
          </button>
          {claimResponse && (
            <div className="claim-response">
              <p>{claimResponse.message}</p>
              {claimResponse.coins && (
                <p>Coins claimed: {claimResponse.coins.amount}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
