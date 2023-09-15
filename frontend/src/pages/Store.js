import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Store() {
  const [userCoins, setUserCoins] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [message, setMessage] = useState("");

  const userLocalData = JSON.parse(localStorage.getItem("userData"));

  const username = userLocalData?.user_name;
  const user_id = userLocalData?.user_id;
  const user_token = userLocalData?.user_token;

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

      const storeDataResponse = await axios.get(
        "http://localhost:8000/api/store/getItems"
      );
      setStoreData(storeDataResponse.data.storeDataWithDetails);
    } catch (error) {
      console.error("Error while fetching store data: ", error);
    }
  }, [user_token, username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBuyItem = async (item) => {
    try {
      await axios.post(
        "http://localhost:8000/api/store/buyItem",
        {
          name: item.name,
          type: item.type_id,
          rarity: item.rarity_id,
          price: item.price,
          user_id: user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      await fetchData();

      setMessage("Item added to your inventory!");
    } catch (error) {
      console.error("Error while purchasing item: ", error);
      setMessage("Error while purchasing item");
    }
  };

  return (
    <>
      <div className="store-container m-4">
        <div className="fixed top-0 right-0 p-4 m-4 bg-neutral-800 text-white text-md font-semibold border drop-shadow-md rounded-lg">
          <p>Coins: {userCoins}</p>
        </div>
        <div className="store-items-data bg-neutral-900 border rounded-md p-4">
          {storeData.length === 0 ? (
            <p>Some error occurred while loading store items.</p>
          ) : (
            <ul className="items-data grid grid-cols-5 gap-2">
              {storeData.map((item) => (
                <div
                  className="item-elem border rounded-md p-2"
                  key={item.name}
                >
                  <li>
                    <p className="item-name">Item: {item.name}</p>
                    <p className="item-type">Type: {item.type}</p>
                    <p className="item-rarity">Rarity: {item.rarity}</p>
                    <p className="item-price">Price: {item.price} Coins</p>
                    <button
                      className="buy-item border rounded-md px-3 py-0.5 mt-2 hover:bg-neutral-800"
                      id="buy-item"
                      onClick={() => handleBuyItem(item)}
                    >
                      Buy
                    </button>
                  </li>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
      {message && <p>{message}</p>}
    </>
  );
}
