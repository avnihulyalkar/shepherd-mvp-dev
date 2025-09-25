import Image from "next/image";
import PropTypes from "prop-types";

export default function ListItem({
  items,
  renderIcon,
  clickedItem,
  onItemClick,
  showArrow = true,
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <button
          type="button"
          key={item.name}
          className={`flex flex-row border border-gray-border rounded-lg px-4 py-2 items-center justify-between cursor-pointer transition-all ${
            clickedItem === item.name
              ? "bg-primary  hover:bg-primary-hover"
              : "bg-[#141414] hover:bg-surface-hover"
          }`}
          onClick={() => onItemClick?.(item.name)}
        >
          <div className="flex flex-row gap-2 items-center">
            {renderIcon?.(item)}
            <p className="text-sm text-white">{item.name}</p>
          </div>
          {showArrow && (
            <Image
              src="/images/arrow.png"
              width={15}
              height={15}
              alt="Expand Arrow"
            />
          )}
        </button>
      ))}
    </div>
  );
}

ListItem.propTypes = {
  items: PropTypes.array.isRequired,
  renderIcon: PropTypes.func,
  clickedItem: PropTypes.string,
  onItemClick: PropTypes.func,
  showArrow: PropTypes.bool,
};
