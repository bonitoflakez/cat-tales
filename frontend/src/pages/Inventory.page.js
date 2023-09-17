import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
  InventoryCatsInfo,
  InventoryItemsInfo,
} from "../components/Inventory.components";

import {
  fetchInventoryData,
  handleUseItem,
  handleUseItemClick,
} from "../utils/Inventory.util";

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

  const fetchDataCallBack = useCallback(() => {
    fetchInventoryData(user_token, user_id, setUserCatsData, setUserItemsData);
  }, [user_id, user_token]);

  useEffect(() => {
    fetchDataCallBack();
  }, [username, fetchDataCallBack]);

  return (
    <div className="inventory-container m-4">
      <div className="inventory-container text-white p-2 grid grid-cols-2 gap-2">
        <div className="inventory-left bg-neutral-900  border rounded-md p-4">
          <InventoryCatsInfo userCatsData={userCatsData} />
        </div>
        <div className="inventory-right bg-neutral-900 border rounded-md p-4">
          <InventoryItemsInfo
            userItemsData={userItemsData}
            handleUseItem={handleUseItem(
              catName,
              selectedItem,
              setMessage,
              catId,
              user_token,
              setIsModalOpen,
              fetchDataCallBack
            )}
            handleUseItemClick={(item) =>
              handleUseItemClick(item, setSelectedItem, setIsModalOpen)
            }
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
