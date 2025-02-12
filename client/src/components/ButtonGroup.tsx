import PostButton from "./PostButton";
import ShareButton from "./ShareButton";
import { TokenBalance } from "@/lib/tokenService";

type Props = {
    fid: number;
    balances: TokenBalance[];
}

const ButtonGroup = ({ fid, balances }: Props) => {
  return (
    <div className="button-group flex gap-4 float-right my-4">
      <PostButton fid={fid} />
      <ShareButton balances={balances} />
    </div>
  );
};

export default ButtonGroup;
