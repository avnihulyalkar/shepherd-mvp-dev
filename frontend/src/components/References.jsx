"use client";
import Image from "next/image";
import ListItem from "./ListItem";

export default function References({ clicked, setClicked }) {
  const references = [
    { name: "Hash-collisions.sol" },
    { name: "Invariant.sol" },
    { name: "ReadOnlyReentrancy.sol" },
  ];

  const renderIcon = () => (
    <>
      <Image src="/images/defi.png" width={20} height={20} alt="DeFiHackLabs" />
      <Image src="/images/file.png" width={20} height={20} alt="File" />
    </>
  );

  const handleClick = (itemName) => {
    setClicked(clicked === itemName ? null : itemName);
  };

  return (
    <ListItem
      items={references}
      renderIcon={renderIcon}
      clickedItem={clicked}
      onItemClick={handleClick}
    />
  );
}
