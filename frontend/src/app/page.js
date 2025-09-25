"use client";
import Repositories from "@/components/Repositories";
import References from "@/components/References";
import CollectionPanel from "@/components/CollectionPanel";
import WelcomeModal from "@/components/WelcomeModal";
import { FaFolder, FaLink } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <div className="container mx-auto gap-8 flex flex-col py-8 px-4">
        <CollectionPanel
          title="My Repositories"
          prefixIcon={<FaFolder className="text-md text-gray-400" />}
          description="Access all your previous repositories and hypotheses."
          href="/new-test"
        >
          <Repositories />
        </CollectionPanel>

        <CollectionPanel
          title="References"
          prefixIcon={<FaLink className="text-md text-gray-400" />}
          description="Identify smart contracts with similar vulnerabilities to support your hypothesis."
          href="#"
        >
          <References />
        </CollectionPanel>
      </div>
      <WelcomeModal />
    </>
  );
}
