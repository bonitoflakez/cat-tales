import axios from "axios";

const handleUseItemClick = (item, setSelectedItem, setIsModalOpen) => {
  setSelectedItem(item);
  setIsModalOpen(true);
};

const handleUseItem = async (
  catName,
  selectedItem,
  setMessage,
  catId,
  user_token,
  setIsModalOpen,
  fetchData
) => {
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

const fetchInventoryData = async (
  user_token,
  user_id,
  setUserCatsData,
  setUserItemsData
) => {
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
};

export { handleUseItem, handleUseItemClick, fetchInventoryData };
