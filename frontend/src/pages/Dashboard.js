import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userCatsData, setUserCatsData] = useState([]);
  const [userItemsData, setUserItemsData] = useState([]);
  const [dailyCoinReward, setDailyCoinReward] = useState([]);
  const [nextClaimTime, setNextClaimTime] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(userData.user_uuid)
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

  // This'll be replaced after session management
  const username = "ooga"; // Set username here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8000/api/player/getPlayer/${username}`
        );
        setUserData(userResponse.data);

        const playerId = userResponse.data.user_id;

        const catResponse = await axios.get(
          `http://localhost:8000/api/player/getPlayerCat/${playerId}`
        );
        setUserCatsData(catResponse.data);

        const itemResponse = await axios.get(
          `http://localhost:8000/api/player/getPlayerItem/${playerId}`
        );
        setUserItemsData(itemResponse.data);

        const coinRewardResponse = await axios.post(
          `http://localhost:8000/api/daily/coins`,
          {
            user_id: playerId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Calculate the next claim time based on the last_claim_time
        const lastClaimTime = userResponse.data.last_claim_time;
        const lastClaimDate = new Date(lastClaimTime);
        const resetInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const nextClaimTime = new Date(lastClaimDate.getTime() + resetInterval);

        // Format time in hh:mm:ss format
        const formattedNextClaimTime = `${nextClaimTime.getHours()}:${nextClaimTime.getMinutes()}`;

        setNextClaimTime(formattedNextClaimTime);

        setDailyCoinReward(coinRewardResponse.data);
      } catch (error) {
        console.error("Error while fetching user details", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <>
      <div className="dashboard-container border m-4">
        <div className="dashboard-container-top bg-neutral-900 text-white p-2 grid grid-cols-2 gap-2">
          <div className="dashboard-user-info border rounded-md p-4">
            <p className="user-name">username: {userData?.username}</p>
            <p className="user-id">
              user id: {/* Add copy icon on front of uuid */}
              <span className="cursor-pointer" onClick={copyToClipboard}>
                {isCopied ? "Copied to clipboard!" : `${userData?.user_id}`}
              </span>
            </p>
            <p className="user-xp">xp: {userData?.xp}</p>
            <p className="user-level">
              level: {Math.floor(userData?.xp / 100)}
            </p>
            <p className="user-coins">coins: {userData?.coins}</p>
          </div>
          <div className="dashboard-inventory-info border rounded-md p-4">
            <p className="user-cats">total cats: {userCatsData.length}</p>
            <p className="user-items">total items: {userItemsData.length}</p>
          </div>
        </div>
        <div className="dashboard-container-bottom bg-neutral-900 text-white p-2">
          <div className="dashboard-additional-details border rounded-md p-4">
            <p className="next-drop-in">
              next drop will be available at: {nextClaimTime}
            </p>
            <p className="user-xp">
              daily reward claimed:{" "}
              {dailyCoinReward.status === "already_claimed"
                ? dailyCoinReward.message
                : dailyCoinReward.coins}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
