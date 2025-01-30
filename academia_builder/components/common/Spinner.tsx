import cn from "classnames";
import { TbFidgetSpinner } from "react-icons/tb";

interface Props {
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
}

export default function Spinner({ sm, md, lg }: Props) {
  const className = cn("animate-spin text-white-300 fill-white-300 mr-2", {
    "w-4 h-4": sm,
    "w-6 h-6": md,
    "w-8 h-8": lg,
  });

  return (
    <div role="status">
      <TbFidgetSpinner className={className} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
