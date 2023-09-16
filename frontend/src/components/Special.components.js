const ItemDropComponent = ({
  itemData,
  fetchItemData,
  isInsufficientCoins,
}) => {
  return (
    <>
      <p>
        <strong>Item name: </strong>
        {itemData.itemName || "Nothing to display"}
      </p>
      <p>
        <strong>Item type: </strong>
        {itemData.itemType || "Nothing to display"}
      </p>
      <p>
        <strong>Item rarity: </strong>
        {itemData.itemRarity || "Nothing to display"}
      </p>
      <button
        className="border px-2 py-0.5 mt-2 rounded-md bg-neutral-900 hover:bg-neutral-800"
        onClick={fetchItemData}
      >
        Fetch an Item (Costs 500 coins)
      </button>
      {isInsufficientCoins && (
        <p className="font-bold p-2">Insufficient coins</p>
      )}
    </>
  );
};

const CatDropComponent = ({
  isCatDataFetched,
  catData,
  handleAdoptCatWithName,
  handleCatDataFetching,
  openCatNameModal,
  isCatNameModalOpen,
  adoptCatName,
  setAdoptCatName,
  closeCatNameModal,
  isInsufficientCoinsForCatto,
}) => {
  return (
    <>
      {isCatDataFetched ? (
        <>
          {catData.catType ? (
            <>
              <p>
                <strong>Cat type: </strong>
                {catData.catType.typeName}
              </p>
              <p>
                <strong>Cat level: </strong>
                {catData.catLevel}
              </p>
            </>
          ) : (
            <p>
              <strong>Cat type: </strong> Nothing to display
              <br />
              <strong>Cat level: </strong> Nothing to display
            </p>
          )}
        </>
      ) : (
        <p>Fetch a cat (Costs 500 coins)</p>
      )}
      {/* take cat name input */}
      <button
        className="border px-2 py-0.5 mt-2 mr-2 rounded-md bg-neutral-900 hover:bg-neutral-800"
        onClick={handleCatDataFetching}
      >
        Fetch a cat
      </button>
      <button
        className="border px-2 py-0.5 mt-2 mr-2 rounded-md bg-neutral-900 hover:bg-neutral-800"
        onClick={openCatNameModal}
      >
        Adopt
      </button>

      {isCatNameModalOpen && (
        <CatNameModal
          adoptCatName={adoptCatName}
          setAdoptCatName={setAdoptCatName}
          handleAdoptCatWithName={handleAdoptCatWithName}
          closeCatNameModal={closeCatNameModal}
        />
      )}
      {isInsufficientCoinsForCatto && (
        <p className="font-bold p-2">Insufficient coins</p>
      )}
    </>
  );
};

const CatNameModal = ({
  adoptCatName,
  setAdoptCatName,
  handleAdoptCatWithName,
  closeCatNameModal,
}) => {
  return (
    <>
      <div className="modal-background">
        <div className="modal-content">
          <h2>Enter Cat Name</h2>
          <input
            type="text"
            placeholder="Enter cat name"
            className="bg-neutral-900 border rounded-md px-1 py-0.5"
            value={adoptCatName}
            onChange={(e) => setAdoptCatName(e.target.value)}
          />
          <button
            className="border px-2 py-0.5 mt-1 mx-1 rounded-md bg-neutral-900 hover:bg-neutral-800"
            onClick={handleAdoptCatWithName}
          >
            Adopt
          </button>
          <button
            className="border px-2 py-0.5 mt-1 ml-1 rounded-md bg-neutral-900 hover:bg-neutral-800"
            onClick={closeCatNameModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

const CoinDropComponent = ({
  dailyCoinCheck,
  handleClaimDailyReward,
  claimResponse,
  nextClaimTime,
}) => {
  return (
    <>
      <p className="next-drop-in">
        <strong>next drop will be available at:</strong> {nextClaimTime}
      </p>
      <p className="user-xp">
        <strong>daily reward claimed: </strong>
        {dailyCoinCheck.status === "already_claimed" ||
        dailyCoinCheck.status === "ready_to_claim"
          ? dailyCoinCheck.message
          : "Couldn't fetch reward status"}
      </p>
      <button
        className="claim-daily-reward border p-1 mt-2 rounded-md"
        onClick={handleClaimDailyReward}
      >
        Claim Daily Reward
      </button>
      {claimResponse && (
        <div className="claim-response">
          <p>{claimResponse.message}</p>
          {claimResponse.coins && (
            <p>Coins claimed: {claimResponse.coins.amount}</p>
          )}
        </div>
      )}
    </>
  );
};

export { ItemDropComponent, CatDropComponent, CoinDropComponent };
