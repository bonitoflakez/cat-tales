import { useEffect, useState } from "react";
import axios from "axios";
import { sampleAdditionalData } from "../utils/sampleData";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [userInventoryData, setUserInventoryData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [userCatsData, setUserCatsData] = useState([]);
  const [totalCats, setTotalCats] = useState(0);
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

  useEffect(() => {
    let player = "ooga";
    axios
      .get(`http://localhost:8000/api/player/getPlayer/${player}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user data: ", err);
      });
  }, []);

  let playerName = userData?.username;
  let playerId = userData?.user_id;
  let playerXp = userData?.xp;
  let playerLevel = Math.floor(userData?.xp / 100);
  let playerCoins = userData?.coins;

  useEffect(() => {
    let uuid = playerId;
    axios
      .get(`http://localhost:8000/api/player/getPlayerItem/${uuid}`)
      .then((res) => {
        setUserInventoryData(res.data);
        setTotalItems(res.data.length);
      })
      .catch((err) => {
        console.error("Faled to fetch user inventory data: ", err);
      });
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/player/getPlayerItem/${playerId}`)
      .then((res) => {
        setUserInventoryData(res.data);
        setTotalItems(res.data.length);
      })
      .catch((err) => {
        console.error("Faled to fetch user inventory data: ", err);
      });
  });

  // Display items
  // {userInventoryData.map((item) => (
  //   <div key={item.id}>
  //     {/* Display item details */}
  //     <p>{item.name}</p>
  //     {/* ... Other item details */}
  //   </div>
  // ))}

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/player/getPlayerCat/${playerId}`)
      .then((res) => {
        setUserCatsData(res.data);
        setTotalCats(res.data.length);
      })
      .catch((err) => {
        console.error("Faled to fetch user inventory data: ", err);
      });
  });

  // Display cats
  // {setUserCatsData.map((cat) => (
  //   <div key={cat.id}>
  //     {/* Display cat details */}
  //     <p>{cat.name}</p>
  //     {/* ... Other cat details */}
  //   </div>
  // ))}

  return (
    <>
      <div className="dashboard-container border m-4">
        <div className="dashboard-container-top bg-neutral-900 text-white p-2 grid grid-cols-2 gap-2">
          <div className="dashboard-user-info border rounded-md p-4">
            <p className="user-name">username: {playerName}</p>
            <p className="user-id">
              user id: {/* Add copy icon on front of uuid */}
              <span className="cursor-pointer" onClick={copyToClipboard}>
                {isCopied ? "Copied to clipboard!" : `${playerId}`}
              </span>
            </p>
            <p className="user-xp">xp: {playerXp}</p>
            <p className="user-level">level: {playerLevel}</p>
            <p className="user-coins">coins: {playerCoins}</p>
          </div>
          <div className="dashboard-inventory-info border rounded-md p-4">
            <p className="user-cats">total cats: {totalCats}</p>
            <p className="user-items">total items: {totalItems}</p>
          </div>
        </div>
        <div className="dashboard-container-bottom bg-neutral-900 text-white p-2">
          <div className="dashboard-additional-details border rounded-md p-4">
            <p className="next-drop-in">
              next drop in: {sampleAdditionalData.nextDropIn}
            </p>
            <p className="user-xp">
              daily reward claimed: {sampleAdditionalData.claimedToday}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
