import PostButton from "./PostButton";
import ShareButton from "./ShareButton";

type Props = {
    fid: number;
}

const ButtonGroup = ({ fid }: Props) => {
  return (
    <div className="button-group flex gap-4 float-right">
      <PostButton fid={fid} />
      <ShareButton />
    </div>
  );
};

export default ButtonGroup;
