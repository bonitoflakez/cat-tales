const StoreComponent = ({ storeData, handleBuyItem }) => {
  return (
    <>
      {storeData.length === 0 ? (
        <p>Some error occurred while loading store items.</p>
      ) : (
        <ul className="items-data grid grid-cols-5 gap-2">
          {storeData.map((item) => (
            <div className="item-elem border rounded-md p-2" key={item.name}>
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
    </>
  );
};

export { StoreComponent };
