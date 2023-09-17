import { useState, useEffect, useCallback } from "react";

import {
  CatDropComponent,
  CoinDropComponent,
  ItemDropComponent,
} from "../components/Special.components";

import {
  fetchItemData,
  handleAdoptCatWithName,
  handleClaimDailyReward,
  handleCatDataFetching,
  openCatNameModal,
  closeCatNameModal,
  fetchSpecialData,
} from "../utils/Special.util";

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

  const fetchData = useCallback(() => {
    fetchSpecialData(
      username,
      user_token,
      setUserCoins,
      user_id,
      setNextClaimTime,
      setDailyCoinCheck
    );
  }, [user_id, user_token, username]);

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
            fetchItemData={fetchItemData(
              user_id,
              user_token,
              setIsInsufficientCoins,
              setItemData
            )}
            isInsufficientCoins={isInsufficientCoins}
          />
        </div>
        <div className="cat-drop border rounded-md p-2">
          <CatDropComponent
            isCatDataFetched={isCatDataFetched}
            catData={catData}
            handleAdoptCatWithName={handleAdoptCatWithName(
              user_id,
              catData,
              adoptCatName,
              user_token
            )}
            handleCatDataFetching={handleCatDataFetching(
              user_id,
              user_token,
              setIsInsufficientCoinsForCatto,
              setIsCatDataFetched,
              setCatData
            )}
            openCatNameModal={openCatNameModal(setIsCatNameModalOpen)}
            isCatNameModalOpen={isCatNameModalOpen}
            adoptCatName={adoptCatName}
            setAdoptCatName={setAdoptCatName}
            closeCatNameModal={closeCatNameModal(setIsCatNameModalOpen)}
            isInsufficientCoinsForCatto={isInsufficientCoinsForCatto}
          />
        </div>
        <div className="coin-drop border rounded-md p-2">
          <CoinDropComponent
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
