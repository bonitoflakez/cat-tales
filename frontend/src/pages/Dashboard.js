import { userData, inventoryData, additionalData } from "../utils/sampleData";

export default function Dashboard() {
  return (
    <>
      <div className="dashboard-container">
        <div className="container m-4 dashboard-user-info">
          <p className="user-name">username: {userData.uname}</p>
          <p className="user-xp">xp: {userData.xp}</p>
          <p className="user-level">level: {userData.level}</p>
        </div>
        <div className="container m-4  dashboard-inventory-info">
          <p className="user-cats">total cats: {inventoryData.cats}</p>
          <p className="user-items">total items: {inventoryData.items}</p>
        </div>
        <div className="container m-4 dashboard-additional-details">
          <p className="next-drop-in">
            next drop in: {additionalData.nextDropIn}
          </p>
          <p className="user-xp">
            daily reward claimed: {additionalData.claimedToday}
          </p>
        </div>
      </div>
    </>
  );
}
