import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  InventoryCatsInfo,
  InventoryItemsInfo,
} from "../components/Inventory.components";

export default function Inventory() {
  const [userCatsData, setUserCatsData] = useState([]);
  const [userItemsData, setUserItemsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [catName, setCatName] = useState("");
  const [catId, setCatId] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userLocalData = JSON.parse(localStorage.getItem("userData"));

  const username = userLocalData?.user_name;
  const user_id = userLocalData?.user_id;
  const user_token = userLocalData?.user_token;

  const fetchData = useCallback(async () => {
    try {
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
    } catch (error) {
      console.error("Error while fetching user details", error);
    }
  }, [user_id, user_token]);

  useEffect(() => {
    fetchData();
  }, [username, fetchData]);

  const handleUseItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleUseItem = async () => {
    if (!catName || !selectedItem) {
      setMessage("Please select an item and provide a cat name.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/player/useItem",
        {
          itemName: selectedItem.name,
          type: selectedItem.type,
          rarity: selectedItem.rarity,
          userId: selectedItem.user_id,
          catName: catName,
          catId: catId,
        },
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        }
      );

      setIsModalOpen(false);
      setMessage("Item used successfully!");

      fetchData();
    } catch (error) {
      console.error("Error while using item", error);
      setMessage("Error while using item");
    }
  };

  return (
    <div className="inventory-container m-4">
      <div className="inventory-container text-white p-2 grid grid-cols-2 gap-2">
        <div className="inventory-left bg-neutral-900  border rounded-md p-4">
          <InventoryCatsInfo userCatsData={userCatsData} />
        </div>
        <div className="inventory-right bg-neutral-900 border rounded-md p-4">
          <InventoryItemsInfo
            userItemsData={userItemsData}
            handleUseItem={handleUseItem}
            handleUseItemClick={handleUseItemClick}
            selectedItem={selectedItem}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            catName={catName}
            catId={catId}
            setCatName={setCatName}
            setCatId={setCatId}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
