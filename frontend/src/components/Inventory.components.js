const InventoryCatsInfo = ({ userCatsData }) => {
  return (
    <>
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
    </>
  );
};

const InventoryItemsInfoModal = ({
  catName,
  catId,
  setCatName,
  setCatId,
  handleUseItem,
  setIsModalOpen,
  message,
}) => {
  return (
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
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
      <p>{message}</p>
    </div>
  );
};

const InventoryItemsInfo = ({
  userItemsData,
  handleUseItem,
  handleUseItemClick,
  selectedItem,
  isModalOpen,
  setIsModalOpen,
  catName,
  catId,
  setCatName,
  setCatId,
  message,
}) => {
  return (
    <>
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
        <div
          className={`fixed inset-0 flex items-center justify-center ${
            isModalOpen ? "block" : "hidden"
          }`}
        >
          <InventoryItemsInfoModal
            catName={catName}
            catId={catId}
            setCatName={setCatName}
            setCatId={setCatId}
            handleUseItem={handleUseItem}
            setIsModalOpen={setIsModalOpen}
            message={message}
          />
        </div>
      )}
    </>
  );
};

export { InventoryCatsInfo, InventoryItemsInfo };
