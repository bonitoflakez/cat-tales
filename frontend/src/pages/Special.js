import { useState, useEffect } from "react";
import axios from "axios";

export default function Daily() {
  const [catData, setCatData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [adoptCatName, setAdoptCatName] = useState("");
  const [nextClaimTime, setNextClaimTime] = useState([]);
  const [dailyCoinCheck, setDailyCoinCheck] = useState([]);
  const [claimResponse, setClaimResponse] = useState(null);
  const [isCatNameModalOpen, setIsCatNameModalOpen] = useState(false);
  const [isCatDataFetched, setIsCatDataFetched] = useState(false);

  const username = "ooga";

  const openCatNameModal = () => {
    setIsCatNameModalOpen(true);
  };

  const closeCatNameModal = () => {
    setIsCatNameModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const userResponse = await axios.get(
        `http://localhost:8000/api/player/getPlayer/${username}`
      );
      setUserData(userResponse.data);

      const playerId = userResponse.data.user_id;

      const coinRewardCheck = await axios.post(
        "http://localhost:8000/api/daily/check",
        {
          user_id: playerId,
        },
        {
          headers: {
            "Content-Type": "application/json",
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

  const handleClaimDailyReward = async () => {
    try {
      const playerId = userData?.user_id;

      if (!playerId) {
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
          user_id: playerId,
        }
      );

      setClaimResponse(claimResponse.data);
    } catch (error) {
      console.error("Error while claiming daily reward", error);
    }
  };

  const handleCatDataFetching = async () => {
    try {
      const playerId = userData?.user_id;

      if (!playerId) {
        console.error("User ID is missing");
        return;
      }

      const fetchCatto = await axios.post(
        "http://localhost:8000/api/cat/drop",
        {
          user_id: playerId,
        }
      );

      setIsCatDataFetched(true);
      setCatData(fetchCatto.data);
    } catch (error) {
      console.error("Error while fetching cat data:", error);
    }
  };

  const handleAdoptCatWithName = async () => {
    try {
      const playerId = userData?.user_id;

      if (!playerId) {
        console.error("User ID is missing.");
        return;
      }

      const catType = catData.catType.typeId;
      const catLevel = catData.catLevel;

      console.log(adoptCatName, catType, catLevel, playerId);

      const adoptResponse = await axios.post(
        "http://localhost:8000/api/cat/adopt",
        {
          name: adoptCatName,
          type: catType,
          level: catLevel,
          user_id: playerId,
        }
      );

      console.log(adoptResponse.data);
    } catch (error) {
      console.error("Error while adopting a cat:", error);
    } finally {
      closeCatNameModal();
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <>
      <div className="drop-container grid grid-cols-3 gap-2 m-4">
        <div className="item-drop border rounded-md p-2">
          <p>
            <strong>Item name:</strong>{" "}
          </p>
          <p>
            <strong>Item type:</strong>{" "}
          </p>
          <p>
            <strong>Item rarity:</strong>{" "}
          </p>
          <button className="border px-2 py-0.5 mt-2 rounded-md bg-neutral-900 hover:bg-neutral-800">
            Add to inventory
          </button>
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
