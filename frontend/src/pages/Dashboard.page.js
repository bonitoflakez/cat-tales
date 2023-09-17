import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { claimTimeCalculator } from "../utils/claimTimeCalculator.util";

import {
  UserInfo,
  InventoryInfo,
  CoinRewardInfo,
} from "../components/Dashboard.components";

import {
  copyToClipboard,
  fetchDashboardData,
  handleClaimDailyReward,
} from "../utils/Dashboard.utils";

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

  const fetchData = useCallback(() => {
    fetchDashboardData(
      username,
      user_token,
      user_id,
      setUserData,
      setUserCatsData,
      setUserItemsData,
      claimTimeCalculator,
      setNextClaimTime,
      setDailyCoinCheck
    );
  }, [user_id, username, user_token]);

  useEffect(() => {
    fetchData();
  }, [user_token, fetchData]);

  return (
    <>
      <div className="dashboard-container m-4">
        <div className="dashboard-container-top text-white p-2 grid grid-cols-2 gap-2">
          <UserInfo
            userData={userData}
            copyToClipboard={copyToClipboard(user_id, setIsCopied)}
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
            handleClaimDailyReward={handleClaimDailyReward(
              user_id,
              dailyCoinCheck,
              user_token,
              setClaimResponse
            )}
            claimResponse={claimResponse}
            nextClaimTime={nextClaimTime}
          />
        </div>
      </div>
    </>
  );
}
