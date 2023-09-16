const UserInfo = ({ userData, copyToClipboard, isCopied }) => {
  return (
    <div className="dashboard-user-info bg-neutral-900 border rounded-md p-4">
      <p className="user-name">
        <strong>Username:</strong> {userData?.username}
      </p>
      <p className="user-id">
        <strong>User Id:</strong> {/* Add copy icon on front of uuid */}
        <span className="cursor-pointer" onClick={copyToClipboard}>
          {isCopied ? "Copied to clipboard!" : `${userData?.user_id}`}
        </span>
      </p>
      <p className="user-xp">
        <strong>Player XP:</strong> {userData?.xp}
      </p>
      <p className="user-level">
        <strong>Player Level:</strong> {Math.floor(userData?.xp / 100)}
      </p>
      <p className="user-coins">
        <strong>Coins:</strong> {userData?.coins}
      </p>
    </div>
  );
};

const InventoryInfo = ({ userCatsData, userItemsData }) => {
  return (
    <div className="dashboard-inventory-info bg-neutral-900 border rounded-md p-4">
      <p className="user-cats">
        <strong>total cats:</strong> {userCatsData.length || 0}
      </p>
      <p className="user-items">
        <strong>total items:</strong> {userItemsData.length || 0}
      </p>
    </div>
  );
};

const CoinRewardInfo = ({
  dailyCoinCheck,
  handleClaimDailyReward,
  claimResponse,
  nextClaimTime,
}) => {
  return (
    <div className="dashboard-additional-details bg-neutral-900 border rounded-md p-4">
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
        disabled={dailyCoinCheck.status !== "ready_to_claim"}
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
    </div>
  );
};

export { UserInfo, InventoryInfo, CoinRewardInfo };
