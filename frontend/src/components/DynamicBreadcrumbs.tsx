import { IoMdCamera } from "react-icons/io";
import { AiFillRead } from "react-icons/ai";
import { IoNewspaperSharp } from "react-icons/io5";

type Props = {
  courseTitle?: string;
  chapterTitle?: string;
  lessonTitle?: string;
};

export default function DynamicBreadcrumbs({ courseTitle = "…", chapterTitle = "…", lessonTitle = "…" }: Props) {
  return (
    <div className="p-2 breadcrumbs text-sm flex flex-1">
      <ul>
        <li>
          <span className="inline-flex items-center gap-2">
            <IoMdCamera />
            {courseTitle}
          </span>
        </li>
        <li>
          <span className="inline-flex items-center gap-2">
            <AiFillRead />
            {chapterTitle}
          </span>
        </li>
        <li>
          <span className="inline-flex items-center gap-2">
            <IoNewspaperSharp />
            {lessonTitle}
          </span>
        </li>
      </ul>
    </div>
  );
}


