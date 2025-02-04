import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AddressInputProps {
  onSubmit: (address: string) => void;
  isLoading: boolean;
}

export default function AddressInput({ onSubmit, isLoading }: AddressInputProps) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSubmit(address.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Enter EVM address (0x...)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" disabled={!address.trim() || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </>
        ) : (
          'Analyze'
        )}
      </Button>
    </form>
  );
}
