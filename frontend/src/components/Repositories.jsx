import Image from "next/image";
import ListItem from "./ListItem";

export default function Repositories() {
  const repositories = [
    { name: "thaveesi/01/files" },
    { name: "thaveesi/02/files" },
    { name: "thaveesi/03/files" },
    { name: "thaveesi/04/files" },
    { name: "thaveesi/05/files" },
  ];

  const renderIcon = () => (
    <Image src="/images/github.png" width={20} height={20} alt="GitHub" />
  );

  return (
    <ListItem
      items={repositories}
      renderIcon={renderIcon}
      clickedItem={null}
      onItemClick={null}
    />
  );
}
