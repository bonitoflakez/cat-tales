import { useEffect, useState } from "react";
import axios from "axios";

export default function Inventory() {
  const [userCatsData, setUserCatsData] = useState([]);
  const [userItemsData, setUserItemsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [catName, setCatName] = useState("");
  const [message, setMessage] = useState("");

  const username = "ooga";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8000/api/player/getPlayer/${username}`
        );

        const playerId = userResponse.data.user_id;

        const catResponse = await axios.get(
          `http://localhost:8000/api/player/getPlayerCat/${playerId}`
        );
        setUserCatsData(catResponse.data);

        const itemResponse = await axios.get(
          `http://localhost:8000/api/player/getPlayerItem/${playerId}`
        );
        setUserItemsData(itemResponse.data);
      } catch (error) {
        console.error("Error while fetching user details", error);
      }
    };

    fetchData();
  }, [username]);

  const handleUseItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleUseItem = async () => {
    if (!catName || !selectedItem) {
      setMessage("Please select an item and provide a cat name.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/player/useItem",
        {
          itemName: selectedItem.name,
          type: selectedItem.type,
          rarity: selectedItem.rarity,
          userId: selectedItem.user_id,
          catName: catName,
        }
      );

      // Handle the response or any other logic you need
      console.log(response.data);
      setMessage("Item used successfully!");
    } catch (error) {
      console.error("Error while using item", error);
      setMessage("Error while using item");
    }
  };

  return (
    <div className="inventory-container m-4">
      <div className="inventory-container text-white p-2 grid grid-cols-2 gap-2">
        <div className="inventory-left bg-neutral-900  border rounded-md p-4">
          <h2 className="font-bold text-xl">Cats</h2>
          {userCatsData.has_cats === false ? (
            <p>No cats found</p>
          ) : (
            <ul>
              {userCatsData.map((cat) => (
                <li key={cat.id}>
                  {cat.name}, level: {cat.level}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="inventory-right bg-neutral-900 border rounded-md p-4">
          <h2 className="font-bold text-xl">Items</h2>
          {userItemsData.has_items === false ? (
            <p>No items found</p>
          ) : (
            <ul className="items">
              {userItemsData.map((item) => (
                <div className="item" key={item.id}>
                  <li>
                    {item.name}, rarity: {item.rarity}
                    <button
                      className="use-item border p-1 mt-1 ml-3 rounded-md"
                      onClick={() => handleUseItemClick(item)}
                    >
                      Use this item
                    </button>
                  </li>
                </div>
              ))}
            </ul>
          )}
          {selectedItem && (
            <div className="use-item-form">
              <input
                type="text"
                placeholder="Enter cat name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="bg-black p-1 rounded-md"
              />
              <button
                className="use-item border p-1 mt-1 ml-3 rounded-md"
                onClick={handleUseItem}
              >
                Use Item
              </button>
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
