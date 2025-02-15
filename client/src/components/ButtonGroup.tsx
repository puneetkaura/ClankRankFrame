import PostButton from "./PostButton";
import ShareButton from "./ShareButton";
import { TokenBalance } from "@/lib/tokenService";
import FrameSDK from "@farcaster/frame-sdk";

type Props = {
    fid: number;
    balances: TokenBalance[];
    sdk: typeof FrameSDK;
}

const ButtonGroup = ({ fid, balances, sdk }: Props) => {
  return (
    <div className="button-group flex gap-4 float-right my-4">
      <PostButton fid={fid} />
      <ShareButton balances={balances} sdk={sdk} />
    </div>
  );
};

export default ButtonGroup;
