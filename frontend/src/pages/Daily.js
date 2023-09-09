export default function Daily() {
  return (
    <>
      <div className="drop-container grid grid-cols-3 gap-2 m-4">
        <div className="item-drop border rounded-md p-2">
          <p>Item name: </p>
          <p>Item type: </p>
          <p>Item rarity: </p>
          <button className="border px-2 py-0.5 mt-2 rounded-md bg-neutral-900 hover:bg-neutral-800">
            Add to inventory
          </button>
        </div>
        <div className="cat-drop border rounded-md p-2">
          <p>Cat name: </p>
          <p>Cat type: </p>
          <p>Cat level: </p>
          {/* take cat name input */}
          <button className="border px-2 py-0.5 mt-2 rounded-md bg-neutral-900 hover:bg-neutral-800">
            Adopt
          </button>
        </div>
        <div className="coin-drop border rounded-md p-2"></div>
      </div>
    </>
  );
}
