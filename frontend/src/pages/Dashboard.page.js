import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { claimTimeCalculator } from "../utils/claimTimeCalculator.util";

import {
  UserInfo,
  InventoryInfo,
  CoinRewardInfo,
} from "../components/Dashboard.components";

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

  return (
    <>
      <div className="dashboard-container m-4">
        <div className="dashboard-container-top text-white p-2 grid grid-cols-2 gap-2">
          <UserInfo
            userData={userData}
            copyToClipboard={copyToClipboard}
            isCopied={isCopied}
          />
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
            nextClaimTime={nextClaimTime}
          />
        </div>
      </div>
    </>
  );
}
