import { Badge } from "@material-ui/core";
import { img_300, unavailable } from "../../config/config";
import ContentModal from "../../contentModal/ContentModal";
import "./singe.scss";
export default function SingeContext({ content }) {
  const {
    id,
    poster_path,
    vote_average,
    media_type,
    release_date,
    title
  } = content;

  return (
    <ContentModal media_type={media_type} id={id}>
      <Badge
        badgeContent={vote_average}
        color={vote_average > 7 ? "primary" : "secondary"}
      />
      <img
        className="poster"
        src={`${img_300}/${poster_path}` || unavailable}
        alt={title}
      />
      <b className="title">{title}</b>
      <div className="subTitle">
        <span>{media_type === "tv" ? "Tv Series " : "Movies "}</span>
        <span>{release_date}</span>
      </div>
    </ContentModal>
  );
}
