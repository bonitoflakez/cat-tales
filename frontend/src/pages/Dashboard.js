import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { claimTimeCalculator } from "../utils/claimTimeCalculator";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userCatsData, setUserCatsData] = useState([]);
  const [userItemsData, setUserItemsData] = useState([]);
  const [nextClaimTime, setNextClaimTime] = useState([]);
  const [dailyCoinCheck, setDailyCoinCheck] = useState([]);
  const [claimResponse, setClaimResponse] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const userLocalData = JSON.parse(localStorage.getItem("userData"));

  const username = userLocalData?.user_name;
  const user_id = userLocalData?.user_id;
  const user_token = userLocalData?.user_token;

  const fetchData = useCallback(async () => {
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
  }, [user_id, username, user_token]);

  const copyToClipboard = () => {
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

  useEffect(() => {
    fetchData();
  }, [user_token, fetchData]);

  function UserInfo({ userData }) {
    return (
      <div className="dashboard-user-info bg-neutral-900 border rounded-md p-4">
        <p className="user-name">
          <strong>Username:</strong> {userData?.username}
        </p>
        <p className="user-id">
          <strong>User Id:</strong> {/* Add copy icon on front of uuid */}
          <span className="cursor-pointer" onClick={copyToClipboard}>
            {isCopied ? "Copied to clipboard!" : `${userData?.user_id}`}
          </span>
        </p>
        <p className="user-xp">
          <strong>Player XP:</strong> {userData?.xp}
        </p>
        <p className="user-level">
          <strong>Player Level:</strong> {Math.floor(userData?.xp / 100)}
        </p>
        <p className="user-coins">
          <strong>Coins:</strong> {userData?.coins}
        </p>
      </div>
    );
  }

  function InventoryInfo({ userCatsData, userItemsData }) {
    return (
      <div className="dashboard-inventory-info bg-neutral-900 border rounded-md p-4">
        <p className="user-cats">
          <strong>total cats:</strong> {userCatsData.length || 0}
        </p>
        <p className="user-items">
          <strong>total items:</strong> {userItemsData.length || 0}
        </p>
      </div>
    );
  }

  function CoinRewardInfo({
    dailyCoinCheck,
    handleClaimDailyReward,
    claimResponse,
  }) {
    return (
      <div className="dashboard-additional-details bg-neutral-900 border rounded-md p-4">
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
          disabled={dailyCoinCheck.status !== "ready_to_claim"}
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
    );
  }

  return (
    <>
      <div className="dashboard-container m-4">
        <div className="dashboard-container-top text-white p-2 grid grid-cols-2 gap-2">
          <UserInfo userData={userData} />
          <InventoryInfo
            userCatsData={userCatsData}
            userItemsData={userItemsData}
          />
        </div>
        <div className="dashboard-container-bottom text-white p-2">
          <CoinRewardInfo
            dailyCoinCheck={dailyCoinCheck}
            handleClaimDailyReward={handleClaimDailyReward}
            claimResponse={claimResponse}
          />
        </div>
      </div>
    </>
  );
}
