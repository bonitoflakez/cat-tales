import { useEffect, useState } from "react";
import axios from "axios";

export default function Inventory() {
  const [userCatsData, setUserCatsData] = useState([]);
  const [userItemsData, setUserItemsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [catName, setCatName] = useState("");
  const [catId, setCatId] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const username = "ooga";

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

  useEffect(() => {
    fetchData(); // Fetch initial data when the component mounts
  }, [username]);

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
      await axios.post("http://localhost:8000/api/player/useItem", {
        itemName: selectedItem.name,
        type: selectedItem.type,
        rarity: selectedItem.rarity,
        userId: selectedItem.user_id,
        catName: catName,
        catId: catId,
      });

      setIsModalOpen(false);
      setMessage("Item used successfully!");

      // Refetch the data after using the item
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
          <h2 className="font-bold text-xl">Cats</h2>
          {userCatsData.has_cats === false ? (
            <p>No cats found</p>
          ) : (
            <ul className="grid grid-cols-3 gap-2">
              {userCatsData.map((cat) => (
                <li key={cat.id} className="border rounded-md p-2">
                  <p>Name: {cat.name}</p>
                  <p>level: {cat.level}</p>
                  <p>Id: {cat.id}</p>
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
            <ul className="items grid grid-cols-3 gap-2">
              {userItemsData.map((item) => (
                <div className="item border p-2 rounded-md" key={item.id}>
                  <li>
                    <p>{item.name}</p>
                    <p>Rarity: {item.rarity}</p>
                    <button
                      className="use-item border p-1 mt-1 rounded-md"
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
            /* Modal */
            <div
              className={`fixed inset-0 flex items-center justify-center ${
                isModalOpen ? "block" : "hidden"
              }`}
            >
              <div className="modal bg-neutral-900 w-1/2 p-4 rounded-md">
                <h2 className="font-bold text-xl">Use Item</h2>
                <div className="my-2">
                  <input
                    type="text"
                    placeholder="Enter cat name"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="bg-black p-1 rounded-md border"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter cat id"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                    className="bg-black p-1 mb-1 rounded-md border"
                  />
                </div>
                <button
                  className="use-item border p-1 mt-1 rounded-md"
                  onClick={handleUseItem}
                >
                  Use Item
                </button>
                <button
                  className="close-modal border p-1 mt-1 ml-2 rounded-md"
                  onClick={() => setIsModalOpen(false)} // Close the modal when "Close" is clicked
                >
                  Close
                </button>
                <p>{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
