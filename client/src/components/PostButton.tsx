import { useState } from "react";
import { FaPlus } from "react-icons/fa";

type Props = {
    fid: number;
}

export default function PostButton({ fid }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://json-storage-vault-pkaura.replit.app/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join_waitlist", fid: fid }),
      });

      if (response.ok) {
        alert("Joined waitlist successfully!");
        setHasJoined(true);
      } else {
        alert("Failed to join waitlist.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="button post-button flex items-center gap-2"
      onClick={handleClick}
      disabled={isLoading || hasJoined}
    >
      <FaPlus />
      {isLoading ? "Joining..." : hasJoined ? "Joined!" : "Join Waitlist"}
    </button>
  );
}
